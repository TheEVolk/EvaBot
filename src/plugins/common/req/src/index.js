import initUserMethods from './userMethods'
import startDataSaver from './dataSaver'

export default class {
  constructor (henta) {
    this.henta = henta
    this.tags = {}
    this.requests = new Set()
  }

  init (henta) {
    initUserMethods(this)

    const { messageProcessor } = henta.getPlugin('common/bot')
    messageProcessor.handlers.set('requests', this.handler.bind(this))
  }

  async start (henta) {
    await startDataSaver(this)
  }

  async handler (ctx, next) {
    const reply = ctx.replyMessage

    if (!reply || reply.senderId !== -ctx.henta.groupId) {
      return next()
    }

    if (!['+', '-', '1', '0', 'да', 'нет', 'отмена'].includes(ctx.text.toLowerCase())) {
      return next()
    }

    const req = Array.from(this.requests).find((i) => reply.text.includes(`(${i.code})`))

    if (!req) {
      return next()
    }

    if (ctx.user.vkId === req.vkId) {
      await this.processSelf(ctx, req)
    } else if (req.sourceId && ctx.user.vkId === req.sourceId) {
      this.processSource(ctx, req)
    }

    await next()
  }

  async processSelf (ctx, req) {
    this.requests.delete(req)

    req.payload = req.payload || {}
    if (req.sourceId) {
      req.payload.source = await ctx.getPlugin('common/users').get(req.sourceId)
    }

    if (req.peers[0] !== ctx.peerId) {
      req.peers.push(ctx.peerId)
    }

    req.payload.peers = req.payload.peers || req.peers

    switch (ctx.text.toLowerCase()) {
      case '+':
      case '1':
      case 'принять':
      case 'да':
        await this.tags[req.tag].allow(ctx, req.payload)
        break
      case '-':
      case '0':
      case 'отклонить':
      case 'нет':
      case 'отмена':
        await this.tags[req.tag].deny(ctx, req.payload)
        break
    }
  }

  processSource (ctx, req) {
    if (ctx.msg.text.toLowerCase() !== 'отмена') {
      return
    }

    this.requests.delete(req)
    ctx.answer('⭕ Вы отменили свою заявку.')
  }

  getFreeCode () {
    const symbols = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    const getSymbol = () => this.henta.utils.randomElement(symbols)
    while (true) {
      const code = `${getSymbol()}${getSymbol()}`
      if (!Array.from(this.requests).find((i) => i.code === code)) {
        return code
      }
    }
  }

  set (tag, handler) {
    if (this.tags[tag]) {
      throw Error(`Тег ${tag} уже существует`)
    }

    this.tags[tag] = handler
  }
}
