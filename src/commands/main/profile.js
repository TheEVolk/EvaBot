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
      `👀 Профиль ${target}:`,
      target.role !== 'user' && `🔑 Роль: ${target.pex.get().title}.`,
      `💳 Баланс: ${target.moneys.getBrief()} бит.`,
      `🏅 Ачивок: ${unlockedCount}/${list.length} шт.`,
      `✨ ${target.level} ур. (${target.lvl.getProgress()}%).`
      // target.job && `💼 Работа: ${target.getJob().name};`,
      // `🏙 Город: ${target.getPosition()};`,
    ])
  }
}
