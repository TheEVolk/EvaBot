class RouterPlugin {
  constructor (henta) {
    this.henta = henta
  }

  init ({ getPlugin, hookManager }) {
    // getPlugin('common/bot').addHandler(this.handler.bind(this), 0)
    // hookManager.add('bot_answer', this.onBotAnswer.bind(this))
  }

  async handler (ctx, next) {
    if (ctx.payloadValue('command') === 'start') {
      ctx.answer('Напиши мне "меню".')
    }

    if (ctx.answered || ctx.msg.payload) return await next()

    if (ctx.msg.peer_id > 2e9) {
      ctx.answer("❔ Введите <<помощь>>, чтобы получить список команд.")
    } else {
      ctx.answer({
        message: [
          '⌨ Используйте кнопки для игры.',
          '\nЕсли у вас не отображаются кнопки, то обновите версию ВКонтакте. Так же кнопки могут не работать в неофициальных клиентах ВКонтакте.'
        ],

        keyboard: ctx.keyboard().oneTime(true)
      })
    }

    await next()
  }

  onBotAnswer(ctx) {
    const keyboard = ctx.response.getKeyboard()

    if(keyboard && ctx.msg.peer_id > 2e9) {
      delete ctx.response.data.keyboard
      return
    }

    if (ctx.mainMenu == false || !keyboard) return

    keyboard.row().textButton({ label: 'Главное меню', payload: { botcmd: 'меню' } })
  }
}

module.exports = RouterPlugin
