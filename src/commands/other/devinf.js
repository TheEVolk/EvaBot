export default class {
  constructor (henta) {
    Object.assign(this, {
      henta: henta,
      name: 'дев',
      description: 'тех. информация',
      type: 'other',
      emoji: '📜'
    })
  }

  handler (ctx) {
    ctx.answer([
      `>> Движок: [hentavk|HENTA] ${ctx.henta.version}.`,
      `>> Время ответа: ${Math.floor(ctx.getPlugin('common/hentadmin').avgResponseTime)} мс.`
    ])
  }
}
