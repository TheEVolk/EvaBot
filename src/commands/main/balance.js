export default class {
  name = 'баланс'
  description = 'количество бит'
  emoji = '💳'
  arguments = {
    target: { name: 'игрок', type: 'user', optional: true }
  }

  async handler (ctx) {
    const target = ctx.params.target || ctx.user

    ctx.answer([
      target === ctx.user ? `${target.emoji} ${target.r()}:` : null,
      `💳 ${target.money.toLocaleString()} бит.`
    ])
  }
}
