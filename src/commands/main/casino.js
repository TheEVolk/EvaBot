export default class {
  constructor () {
    Object.assign(this, {
      name: 'казино',
      emoji: '🃏',
      description: 'начните зарабатывать уже сейчас!'
    })
  }

  handler (ctx) {
    ctx.answer({
      message: [
        '🃏 Добро пожаловать в казино!',
        '\nИспользуйте кнопки для выбора мини-игры.'
      ],
      keyboard: ctx.keyboard()
        .textButton({
          label: '🔟 Лотерея',
          payload: {
            sbs: {
              type: 'botcmd',
              command: 'лотерея',
              titles: ['На сколько бит вы хотите сыграть?']
            }
          }
        })
        .textButton({
          label: '🌗 Коинфлип',
          payload: {
            sbs: {
              type: 'botcmd',
              command: 'кф',
              titles: [
                'С кем вы хотите сыграть? (ссылка)',
                'На сколько бит вы хотите сыграть?'
              ]
            }
          }
        })
    })
  }
}
