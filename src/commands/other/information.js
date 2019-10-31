export default class InformationCommand {
  name = 'информация'
  description = 'о проекте'
  emoji = '📜'

  handler (ctx) {
    ctx.answer([
      `⚙ Работает на [hentavk|HENTA] ${ctx.henta.version}.`,
      '❔ По вопросам: [evabottp|тех. поддержка]',
      '👤 Создатель: [theevolk|TheEVolk]'
    ])
  }
}
