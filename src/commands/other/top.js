import { Op } from 'sequelize'

const emoji = ['🥇', '🥈', '🥉', '🏅', '🏅']

export default class {
  name = 'топ'
  description = 'богатые игроки'
  emoji = '💸'

  async handler (ctx) {
    const { User } = ctx.getPlugin('common/users')
    const { briefNumber } = ctx.getPlugin('systems/moneys')

    const users = await User.findAll({ order: [['money', 'DESC']], limit: 5 })

    ctx.builder()
      .text('📊 Топ 5 богатых игроков:')
      .lines(users.map(
        (v, i) => `${i + 1}⃣  ${v} — ${briefNumber(v.money)}`)
      )
      //`\n🔼 Вы №${await usersPlugin.User.count({ where: { money: { [Op.gte]: ctx.user.money } } })} в топе!`
      .answer()
  }
}
