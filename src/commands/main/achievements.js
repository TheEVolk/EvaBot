export default class {
  name = 'ачивки'
  description = 'список моих достижений'
  emoji = '🏅'

  drawAchievement (achievement, isOpen) {
    return [
      `${isOpen ? '✔' : '❌'} ${achievement.title}`,
      `- ${achievement.description}.`
    ].join('\n')
  }

  async handler (ctx) {
    const { list, Achievement } = ctx.getPlugin('systems/achievements')
    const unlocked = await Achievement.findAll({ where: { vkId: ctx.user.vkId } })

    ctx.builder()
      .text(`🏅 Открыто ${unlocked.count}/${list.length} достижений.`)
      .lines(list.map(v =>
        this.drawAchievement(v, unlocked.find(a => a.slug === v.slug))
      ))
      .answer()
  }
}
