export default class {
  users = {}

  init (henta) {
    const { messageProcessor } = henta.getPlugin('common/bot')
    messageProcessor.handlers.set('show-beta-notify', this.handler.bind(this))
  }

  handler (ctx, next) {
    if (!this.users[ctx.senderId] || this.users[ctx.senderId] + 3600000 < Date.now()) {
      this.users[ctx.senderId] = Date.now()
      // ctx.send('🔨 Напоминаем, что бот сейчас практически неиграбелен.\nvk.com/bot_eva?w=wall-134466548_5255')
    }

    return next()
  }
}
