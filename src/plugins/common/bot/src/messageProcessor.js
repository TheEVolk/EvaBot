import compose from 'middleware-io'
import applyContextMethods from './messageContext'
import handleError from './errorHandler'
import getHandlers from './defaultMiddleware'
import EventEmitter from 'events'

export default class MessageProcessor extends EventEmitter {
  constructor (bot) {
    super()
    Object.assign(this, {
      bot,
      handlers: new Map()
    })
  }

  async init (bot) {
    const handlersQueue = await bot.henta.util.loadSettings('bot/handlers.json')
    const sortedHandlers = handlersQueue.map(v => this.handlers.get(v))

    this.middleware = compose([
      ...getHandlers(bot),
      ...sortedHandlers
    ])

    bot.henta.vk.updates.on('message', (ctx, next) => this.process(ctx, next))
    // bot.henta.vk.on('message_new', msg => this.process(msg))
  }

  async process (ctx, next) {
    try {
      applyContextMethods(ctx, this.bot.henta)
      await this.middleware(ctx, () => {})
    } catch (err) {
      this.emit('processError', ctx, err)
      handleError(ctx, err, this.bot.henta)
    }

    await next()
  }
}
