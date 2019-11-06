import { Op } from 'sequelize';

class TopSubcommand {
  name = 'топ'

  async handler(ctx) {
    const { User } = ctx.getPlugin('common/users');
    const [users, myPos] = await Promise.all([
      User.findAll({ order: [['money', 'DESC']], limit: 5 }),
      User.count({ where: { money: { [Op.gte]: ctx.user.money } } })
    ]);

    ctx.builder()
      .text('💳 Топ по рейтингу:')
      .lines([
        ...users.map(
          (v, i) => `${i + 1}⃣ ${v}\n— ${v.money.toLocaleString('ru')} бит.`
        ),
        `\n🔼 Вы №${myPos} в топе!`
      ])
      .answer();
  }
}

export default class BalanceCommand {
  name = 'баланс'
  description = 'количество бит'
  emoji = '💳'
  arguments = {
    target: { name: 'игрок', type: 'user', optional: true }
  }

  subcommands = [
    new TopSubcommand()
  ]

  async handler(ctx) {
    const target = ctx.params.target || ctx.user;

    ctx.answer([
      target === ctx.user && `💲 Баланс ${target}:`,
      `💳 ${target.money.toLocaleString('ru')} бит.`
    ]);
  }
}
