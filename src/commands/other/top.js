import { Op } from 'sequelize'

export default class TopCommand {
  name = 'топ'
  description = 'лучшие игроки'
  emoji = '⭐'

  async handler (ctx) {
    const { User } = ctx.getPlugin('common/users')
    const [users, myPos] = await Promise.all([
      User.findAll({ where: { rating: { [Op.not]: null } }, order: [['rating', 'DESC']], limit: 5 }),
      ctx.user.rating && User.count({ where: { rating: { [Op.gte]: ctx.user.rating } } })
    ]);

    ctx.builder()
      .text('⭐ Топ по рейтингу:')
      .lines([
        ...users.map(
          (v, i) => `${i + 1}⃣ ${v}\n— ${v.rating} ед.`
        ),
        myPos && `\n🔼 Вы №${myPos} в топе!`,
        !myPos && '\nВведите `профиль топ`, чтобы пересчитать рейтинг.'
      ])
      .answer();
  }
}