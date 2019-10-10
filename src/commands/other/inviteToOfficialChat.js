export default class {
  constructor (henta) {
    Object.assign(this, {
      henta: henta,
      name: 'беседа',
      description: 'официальный чат'
    })
  }

  async handler (ctx) {
    await ctx.api.friends.add({ access_token: this.henta.configManager.getConfigPrivate().eva_token, user_id: ctx.user.vkId })
    const areFriends = await ctx.api.friends.areFriends({ access_token: this.henta.configManager.getConfigPrivate().eva_token, user_ids: ctx.user.vkId })
    ctx.assert(areFriends[0].friend_status === 3, 'Добавьте @evarobot в друзья, после чего повторите попытку.')
    try {
      await ctx.api.messages.addChatUser({ chat_id: 306, user_id: ctx.user.vkId, access_token: this.henta.configManager.getConfigPrivate().eva_token })
      ctx.answer('🍭 Правила » https://vk.com/@evarobotgroup-rules')
    } catch (e) {
      ctx.answer('Вы уже состоите в беседе.')
    }
  }
}
