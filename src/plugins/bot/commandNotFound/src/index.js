export default class {
  init (henta) {
    const { messageProcessor } = henta.getPlugin('common/bot')
    messageProcessor.handlers.set('commandNotFound', this.handler.bind(this))
  }

  async handler (ctx, next) {
    if (ctx.answered) {
      return next()
    }

    ctx.answer('Команда не найдена. Введите <<меню>> для навигации по боту.')
    await next()
  }
}
