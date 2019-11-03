import { Keyboard } from 'vk-io'
import fetch from 'node-fetch'
import querystring from 'querystring'
import moment from 'moment'

export default class ChatCommand {
  name = 'беседа'
  description = 'в конфу'
  emoji = '🎈'

  constructor () {
    moment.locale('ru')
  }

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

  async checkCmBan (henta, userId) {
    const result = await fetch('https://api.chatmanager.pro?' + querystring.stringify({
      method: 'chats.isMemberBanned',
      token: henta.config.private.cmToken,
      user_id: userId,
      chat_uid: 'cccAbd'
    }))

    const resultData = await result.json()
    console.log({ resultData })
    return resultData.response.banned && resultData.response.time
  }

  async handler (ctx) {
    if (!await this.checkFriends(ctx)) {
      return this.sendFriendsError(ctx)
    }

    const banned = await this.checkCmBan(ctx.henta, ctx.user.vkId)
    if (banned) {
      return ctx.answer([
        `⛔ Вы находитесь в бане чата.`,
        `⏳ Истекает ${moment.unix(banned).fromNow()}.`
      ])
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