class CoinflipRequestHandler {
  accept (ctx, { source, rate, sendResult }) {
    const { briefNumber } = ctx.getPlugin('systems/moneys')

    if (ctx.user.money < rate) {
      return ctx.answer(`⛔ Недостаточно бит.`)
    }

    if (source.money < rate) {
      return ctx.answer(`⛔ У оппонента недостаточно бит.`)
    }

    const winner = Math.random() >= 0.5 ? ctx.user : source
    const looser = winner === ctx.user ? source : ctx.user

    winner.money += rate
    looser.money -= rate
    source.save()

    sendResult([
      `🌗 ${source} vs ${ctx.user}:`,
      `💰 ${rate.toLocaleString('ru')} бит.`,
      `\n⚜ ${winner} победил!`
    ])

    winner.send(`➕ ${briefNumber(rate)} [${briefNumber(winner.money)}].`)
    looser.send(`➖ ${briefNumber(rate)} [${briefNumber(looser.money)}].`)
  }

  deny (ctx, { source }) {
    ctx.answer(`⭕ Вы отклонили приглашение в коинфлип.`)
    source.send(`⭕ ${ctx.user} отклонил ваше приглашение в коинфлип.`)
  }
}

export default class {
  name = 'кф'
  description = 'коинфлип'
  emoji = '🌗'
  arguments = {
    target: { name: 'профиль', type: 'user' },
    rate: { name: 'ставка', type: 'moneys' }
  }

  init (henta) {
    const requestsPlugin = henta.getPlugin('common/requests')
    requestsPlugin.set('games:coinflip', new CoinflipRequestHandler())
  }

  async handler (ctx) {
    const rateStr = ctx.params.rate.toLocaleString('ru')
    const { tip } = ctx.params.target.req.new({
      tag: 'games:coinflip',
      text: `${ctx.user} хочет сыграть с вами в КФ на ${rateStr} бит.`,
      payload: { rate: ctx.params.rate },
      peer: ctx.peerId
    }, ctx.user)

    ctx.answer([
      `💰 Ставка: ${rateStr} бит.`,
      '⏳ Ожидание ответа оппонента...',
      tip
    ])
  }
}
