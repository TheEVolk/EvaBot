export default class {
  name = 'профиль'
  description = 'информация о профиле'
  emoji = '👤'
  arguments = {
    target: { name: 'игрок', type: 'user', optional: true }
  }

  async handler (ctx) {
    const target = ctx.params.target || ctx.user
    ctx.user.achievements.unlockIf('itsMe', target === ctx.user)

    const { list, Achievement } = ctx.getPlugin('systems/achievements')
    const unlockedCount = await Achievement.count({ where: { vkId: ctx.user.vkId } })

    ctx.answer([
      `👀 ${target}:`,
      `🏅 Открыто ${unlockedCount}/${list.length} достижений.`
      // target.role !== 'user' && `🔑 Роль: ${await target.getRoleName()};`,
      // `💳 Баланс: ${target.getBalance()} бит;`,
      // target.job && `💼 Работа: ${target.getJob().name};`,
      // `🏙 Город: ${target.getPosition()};`,
      // `✨ ${target.level} ур. (${target.getScoreProgress()}%).`
    ])
  }
}
