import initBotcmdType from './botcmdType'
import initUserMethods from './userMethods'

export default class {
  constructor (henta) {
    this.henta = henta
  }

  init (henta) {
    initBotcmdType(this)
    initUserMethods(this)

    const { messageProcessor } = henta.getPlugin('common/bot')
    messageProcessor.handlers.set('write-balance', this.writeBalance.bind(this))
    messageProcessor.on('answer', this.balanceLine.bind(this))
  }

  writeBalance (ctx, next) {
    ctx.lastBalance = ctx.user.money
    return next()
  }

  balanceLine (ctx, builder) {
    if (ctx.lastBalance === ctx.user.money) {
      return
    }

    const diff = ctx.user.money - ctx.lastBalance
    const briefedDiff = this.briefNumber(Math.abs(diff))
    const briefedBalance = this.briefNumber(ctx.user.money)
    builder.line(`${diff > 0 ? '➕' : '➖'} ${briefedDiff} бит (${briefedBalance}).`)
  }

  briefNumber (number) {
    let suffix = ''
    if (Math.abs(number) >= 1e9) {
      number /= 1e9
      suffix = 'млрд'
    } else if (Math.abs(number) >= 1e6) {
      number /= 1e6
      suffix = 'млн'
    } else {
      while (Math.abs(number) >= 1e3) {
        number /= 1e3
        suffix += 'к'
      }
    }

    return `${Number(number.toFixed(1))}${suffix}`
  }
}
