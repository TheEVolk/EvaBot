export default class BonCommandsCommand {
  name = 'жмых'
  aliases = ['цитата']
  description = 'удалённые команды'
  private = true

  async handler (ctx) {
    ctx.answer([
      '⚠ Этих функций здесь нет:',
      '🐈 За то они есть в @bonbot.'
    ])
  }
}
