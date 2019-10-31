export default class ShelderCommand {
  name = 'приют'
  description = 'поиск питомца'
  emoji = '🌷'
  private = true

  async handler (ctx) {
    ctx.builder()
      .photo('res/img/indev.png')
      .answer()
  }
}
