export default class DebugPostGame {
  name = 'dpg'
  description = 'дебаг postgame'
  right = 'debug-postgame'
  arguments = {
    name: { name: 'имя', type: 'string' }
  }

  async handler (ctx) {
    try {
      const { default: GameClass } = await import(`${ctx.henta.botdir}/src/postgames/${ctx.params.name}.js`)
      const game = new GameClass()

      ctx.builder()
        .text(`Ответ: ${game.rightAnswer}`)
        .photo(await game.generateImage())
        .answer()
    } catch (err) {
      ctx.answer('Ошибка: ' + err)
    }
  }
}