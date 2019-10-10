/*  MONEYS PLUGIN FOR EVA
    08.2019
*/

const Sequelize = require('sequelize')

class MoneysPlugin {
  constructor (henta, ctx) {
    this.henta = henta
  }

  init ({ getPlugin, hookManager }) {
    const botcmdPlugin = getPlugin('common/botcmd')
    const usersPlugin = getPlugin('common/users')
    const botPlugin = getPlugin('common/bot')

    usersPlugin.addModelField(
      'money',
      { type: Sequelize.INTEGER, allowNull: false, defaultValue: 10000 }
    )

    usersPlugin.addMethod('hasBalance', (self, count) => self.money >= count)

    usersPlugin.addMethod('getBalance', (self) => {
      return this.briefNumber(parseInt(self.money))
    })
    usersPlugin.addMethod('assertBalance', (self, ctx, count) => ctx.assert(
      self.hasBalance(ctx.buyCount ? ctx.buyCount + count : count),
      [
        '💵 Недостаточно средств:',
        `➤ Не хватает ${this.briefNumber((ctx.buyCount ? ctx.buyCount + count : count) - self.money)} бит.`
      ]
    ))

    usersPlugin.addMethod('buy', (self, ctx, count) => {
      self.assertBalance(ctx, count)
      ctx.buyCount = ctx.buyCount ? ctx.buyCount + count : count
    })

    usersPlugin.addMethod('acceptBuy', (self, ctx) => {
      self.money -= ctx.buyCount
    })

    /* botPlugin.addHandler((ctx, next) => {
      ctx.lastBalance = ctx.user.money
      return next()
    }, 8999) */

    /*
    hookManager.add('bot_answer', ctx => {
      if (ctx.lastBalance == ctx.user.money) return
      const diff = ctx.user.money - ctx.lastBalance
      ctx.response.line(`
${diff>0 ? '➕' : '➖'} ${this.briefNumber(Math.abs(diff))} бит (${this.briefNumber(ctx.user.money)}).`)
    })
    */

    botcmdPlugin.addArgumentType('moneys', data => {
      const value = data.ctx.assert(Number(data.arg), '⛔ Вы указали не число')
      data.ctx.assert(value > 0, data.negativeMessage || '⛔ Число должно быть положительным')
      data.ctx.assert(value <= data.ctx.user.money, data.notHaveMessage || '⛔ Недостаточно средств')
      return value
    })
  }

  briefNumber (number) {
    let suffix = ''
    if (Math.abs(number) >= 1e9) {
      number /= 1e9
      suffix = 'млрд'
    } else if (Math.abs(number) >= 1e6) {
      number /= 1e6
      suffix = 'млн'
    } else
      while(Math.abs(number) >= 1e3) {
        number /= 1e3
        suffix += 'к'
    }

    return `${Number(number.toFixed(1))}${suffix}`
  }
}

module.exports = MoneysPlugin
