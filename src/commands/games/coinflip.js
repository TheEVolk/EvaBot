export default class {
  constructor () {
    Object.assign(this, {
      name: 'кф',
      description: 'коинфлип',
      emoji: '🌗',
      arguments: {
        target: { name: 'профиль', type: 'user' },
        rate: { name: 'ставка', type: 'moneys' }
      }
    })
  }

  init (henta) {
    henta.getPlugin('common/requests').addTag(
      'games:coinflip',
      this.acceptGame,
      this.denyGame
    )
  }

  async denyGame (ctx, { source }) {
    source.send(`❌ ${ctx.user.r()} отклонил вашу заявку в КФ.`)
    ctx.answer(`⭕ Заявка на КФ с ${source.r()} отклонена.`)
  }

  async acceptGame (ctx, { source, rate, peers }) {
    ctx.user.assertBalance(ctx, rate)
    ctx.assert(
      source.money >= rate,
      'у оппонента недостаточно средств для игры с вами.'
    )

    const winner = Math.random() >= 0.5 ? ctx.user : source
    const looser = winner === ctx.user ? source : ctx.user

    winner.money += rate
    looser.money -= rate
    source.save()

    const message = [
      `🌗 ${source.r()} и ${ctx.user.r()}:`,
      `💰 Ставка: ${rate.toLocaleString('ru')} бит.`,
      `
⚜ ${winner.r()} победил!`
    ].join('\n')

    peers.forEach((peerId) => ctx.api.messages.send({ peerId, message }))
    ctx.answered = true
  }

  async handler (ctx) {
    const { tip } = ctx.params.target.createRequest({
      tag: 'games:coinflip',
      text: `${ctx.user.r()} хочет сыграть с вами в КФ на ${ctx.params.rate.toLocaleString('ru')} бит.`,
      payload: { rate: ctx.params.rate },
      peer: ctx.msg.peer_id
    }, ctx.user)

    ctx.answer([
      '✅ Вы подали заявку на игру в КФ:',
      `💰 Ставка: ${ctx.params.rate.toLocaleString('ru')} бит.`,
      tip
    ])
  }
}
