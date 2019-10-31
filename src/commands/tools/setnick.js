export default class SetNickCommand {
  name = 'сетник'
  description = 'изменить ник'
  emoji = '🎩'
  right = 'set-nick'
  arguments = {
    target: { name: 'пользователь', type: 'user' },
    role: { name: 'ник', type: 'string', optional: true }
  }

  async handler (ctx) {
    const newNickname = ctx.params.role || ctx.params.target.firstName
    const oldNickname = ctx.params.target.nickName
    ctx.params.target.nickName = newNickname
    ctx.params.target.save()

    ctx.params.target.send([
      `🎩 ${ctx.user} изменил ваш ник:`,
      `⬛ ${oldNickname} » ${newNickname}.`
    ])

    ctx.answer([
      `🎩 Новый ник для ${ctx.params.target}:`,
      `⬛ ${oldNickname} » ${newNickname}.`
    ])
  }
}
