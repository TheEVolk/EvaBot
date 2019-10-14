export default class {
  name = 'кик'
  description = 'исключить из беседы'
  emoji = '👞'
  arguments = {
    target: { name: 'игрок', type: 'user' },
    reason: { name: 'причина', type: 'string' }
  }

  async handler (ctx) {
    await ctx.api.messages.removeChatUser({
      chat_id: ctx.chatId,
      user_id: ctx.params.target.vkId
    })

    ctx.params.target.send([
      `👞 ${ctx.user} исключил вас.`,
      `⬛ Причина: ${ctx.params.reason}.`
    ])

    ctx.answer([
      `👞 ${ctx.params.target} исключен.`,
      `⬛ Причина: ${ctx.params.reason}.`
    ])
  }
}
