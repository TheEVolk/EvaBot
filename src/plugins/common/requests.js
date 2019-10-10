class RequestsPlugin {
  constructor (henta) {
    this.henta = henta
    this.tags = {}
    this.requests = new Set()
  }

  init ({ getPlugin }) {
    const usersPlugin = getPlugin('common/users')
    usersPlugin.addMethod('createRequest', (self, data, source) => {
      const code = this.getFreeCode()
      const createdTime = Math.floor(Date.now() / 1000)
      if (source) data.sourceId = source.vkId
      data.peers = [ data.peer || source.vkid ]
      this.requests.add({ vkId: self.vkId, code, createdTime, ...data })

      self.send([
        `📬 Новая заявка (${code}):`,
        `➤ ${data.text}`,
        '\nВы можете ответить на это сообщение символом +/- чтобы принять или отклонить эту заявку.'
      ])

      const tip = [
        `\n${self.r()} может ответить на вашу заявку переслав это сообщение с символом +/-,`,
        `а так же вы можете отменить эту заявку, переслав это сообщение с текстом "отмена". (${code})`
      ].join(' ')

      return { code, tip }
    })

    // getPlugin('common/bot').addHandler(this.handler.bind(this), 5000)
  }

  async start(henta) {
    const redisPlugin = henta.getPlugin('common/redis')

    process.on('SIGINT', () =>
      redisPlugin.setObject('requests', Array.from(this.requests))
    )

    const requestsSaves = await redisPlugin.getObject('requests')
    if (requestsSaves) {
      requestsSaves.forEach(v => this.requests.add(v))
    }
  }

  async handler (ctx, next) {
    const reply = ctx.msg.reply_message || ctx.msg.fwd_messages && ctx.msg.fwd_messages[0]
    
    if (!reply
      || reply.from_id != -ctx.henta.getConfigValue('vk_groupid')
      || ![ '+', '-', '1', '0', 'да', 'нет', 'отмена' ].includes(ctx.msg.text.toLowerCase()))
      return await next()

    const req = Array.from(this.requests).find((i) => reply.text.includes(`(${i.code})`))

    if (!req) return await next()

    if (ctx.user.vkId == req.vkId)
      await this.processSelf(ctx, req)
    else if(req.sourceId && ctx.user.vkId == req.sourceId)
      this.processSource(ctx, req)

    await next()
  }

  async processSelf(ctx, req) {
    this.requests.delete(req)
    req.payload = req.payload || {}

    if (req.sourceId) {
      req.payload.source = await ctx.getPlugin('common/users').findUser(req.sourceId)
    }

    if (req.peers[0] !== ctx.msg.peer_id) {
      req.peers.push(ctx.msg.peer_id)
    }

    req.payload.peers = req.payload.peers || req.peers

    switch (ctx.msg.text.toLowerCase()) {
      case '+':
      case '1':
      case 'принять':
      case 'да':
        await this.tags[req.tag].allowHandler(ctx, req.payload)
        break
      case '-':
      case '0':
      case 'отклонить':
      case 'нет':
      case 'отмена':
        await this.tags[req.tag].denyHandler(ctx, req.payload)
        break
    }
  }

  processSource(ctx, req) {
    if (ctx.msg.text.toLowerCase() != 'отмена')
      return

    this.requests.delete(req)
    ctx.answer("⭕ Вы отменили свою заявку.")
  }

  getFreeCode () {
    const symbols = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    const getSymbol = () => this.henta.utils.randomElement(symbols)
    while (true) {
      const code = `${getSymbol()}${getSymbol()}`
      if (!Array.from(this.requests).find((i) => i.code == code))
        return code
    }
  }

  addTag (tag, allowHandler, denyHandler) {
    if (this.tags[tag])
      throw Error(`Тег "${tag}" уже существует`)

    this.tags[tag] = { allowHandler, denyHandler}
  }
}

module.exports = RequestsPlugin