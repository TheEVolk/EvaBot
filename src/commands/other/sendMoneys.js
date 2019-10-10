export default class {
  constructor () {
    Object.assign(this, {
      name: 'отправить',
      description: 'переслать биты',
      emoji: '💸',

      arguments: {
        target: { name: 'цель', type: 'user' },
        count: { name: 'кол-во', type: 'moneys' }
      }
    })
  }

  handler (ctx) {
    const { briefNumber } = ctx.getPlugin('mybot/moneys')

    ctx.user.money -= ctx.params.count
    ctx.params.target.money += ctx.params.count

    ctx.params.target.save()

    ctx.params.target.send([
      `💸 ${ctx.user.r()} отправил вам биты!`,
      `\n➕ ${briefNumber(ctx.params.count)} бит (${briefNumber(ctx.params.target.money)}).`
    ])

    ctx.answer(`✔ Биты успешно отправлены на счёт ${ctx.params.target.r()}`)
  }
}
