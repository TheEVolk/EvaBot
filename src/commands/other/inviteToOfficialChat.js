import { Keyboard } from 'vk-io'

export default class {
  name = 'беседа'
  description = 'попасть в офф. конфу'
  emoji = '🎈'

  async checkFriends (ctx) {
    await ctx.api.friends.add({
      access_token: ctx.henta.config.private.pageToken,
      user_id: ctx.user.vkId
    })

    const areFriends = await ctx.api.friends.areFriends({
      access_token: ctx.henta.config.private.pageToken,
      user_ids: ctx.user.vkId
    })

    return areFriends[0].friend_status === 3
  }

  sendFriendsError (ctx) {
    return ctx.builder()
      .lines([
        '🎎 Добавьте @evarobot в друзья, после чего повторите попытку.',
        '🎫 Вы будете добавлены в беседу с помощью этой страницы. Позже вы можете удалить её из друзей.'
      ])
      .keyboard(Keyboard.builder()
        .textButton({ label: `👀 Профиль`, payload: { command: 'профиль' } })
      )
      .answer()
  }

  async handler (ctx) {
    if (!await this.checkFriends(ctx)) {
      return this.sendFriendsError(ctx)
    }

    try {
      await ctx.api.messages.addChatUser({
        chat_id: 306,
        user_id: ctx.user.vkId,
        access_token: ctx.henta.config.private.pageToken
      })

      ctx.answer([
        '🎎 Я добавила тебя в свою беседу.',
        '🍭 Прочитай правила, чтобы тебя не выгнали:',
        'vk.com/@bot_eva-chat-rules'
      ])
    } catch (e) {
      ctx.answer('Вы уже состоите в беседе.')
    }
  }
}
