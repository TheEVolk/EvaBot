export default class {
  name = 'профиль'
  description = 'информация о профиле'
  emoji = '👤'
  arguments = {
    target: { name: 'игрок', type: 'user', optional: true }
  }

  async handler (ctx) {
    const target = ctx.params.target || ctx.user
    ctx.user.achievement.unlockIf('itsMe', target === ctx.user)

    ctx.answer([
      `${target.emoji} ${target.r()}:`,
      target.role !== 'user' && `🔑 Роль: ${await target.getRoleName()};`,
      `💳 Счёт: ${target.getBalance()} бит;`,
      target.job && `💼 Работа: ${target.getJob().name};`,
      `🏙 Город: ${target.getPosition()};`,
      `✨ ${target.level} ур. (${target.getScoreProgress()}%).`
    ])
  }
}
