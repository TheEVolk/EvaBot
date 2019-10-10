export default class {
  constructor (henta) {
    Object.assign(this, {
      name: 'кик',
      arguments: {
        target: { name: 'игрок', type: 'user' },
        reason: { name: 'причина', type: 'string' }
      },
      right: 'kickUser'
    })
  }

  async handler (ctx) {
    await ctx.api.messages.removeChatUser({
      chat_id: ctx.msg.peer_id - 2e9,
      user_id: ctx.params.target.vkId
    })

    ctx.params.target.send([
      `👞 ${ctx.user.r()} исключил вас.`,
      `⬛ Причина: ${ctx.params.reason}.`
    ])

    ctx.answer([
      `👞 ${ctx.params.target.r()} исключен.`,
      `⬛ Причина: ${ctx.params.reason}.`
    ])
  }
}
