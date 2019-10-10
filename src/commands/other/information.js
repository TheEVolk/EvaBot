export default class {
  constructor () {
    Object.assign(this, {
      name: 'информация',
      description: 'о проекте',
      emoji: '📜'
    })
  }

  handler (ctx) {
    ctx.answer([
      '💎 Ева Цифрова:',
      `⚙ Работает на [hentavk|HENTA] ${ctx.henta.version}.`,
      '❔ По вопросам: [evabottp|тех. поддержка]',
      '👤 Создатель: [theevolk|TheEVolk]'
    ])
  }
}
