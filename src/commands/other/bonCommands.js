export default class {
  constructor () {
    Object.assign(this, {
      name: 'жмых',
      aliases: ['цитата'],
      description: 'удалённые команды'
    })
  }

  async handler (ctx) {
    ctx.answer([
      '⚠ Этих функций здесь нет:',
      '🐈 За то они есть в @bonbot.'
    ])
  }
}
