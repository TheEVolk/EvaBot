export default class {
  constructor () {
    Object.assign(this, {
      name: 'город',
      description: 'места в городе',
      emoji: '🏙'
    })
  }

  async handler (ctx) {
    const places = {
      casino: { name: 'Казино', emoji: '🎰', command: 'казино' },
      petshelter: { name: 'Приют', emoji: '🐾', command: 'приют' },
      autosalon: { name: 'Автосалон', emoji: '🚗', command: 'автосалон' }
    }

    const city = ctx.user.getCity()

    const keyboard = ctx.keyboard().oneTime(false)
    city.places.forEach((v, i) => {
      if (i % 2 === 0) keyboard.row()
      const place = places[v]
      keyboard.textButton({
        label: `${place.emoji} ${place.name}`,
        payload: { botcmd: place.command },
        color: 'primary'
      })
    })

    ctx.answer({
      keyboard,
      message: [
      `🏙 Город ${city.name}`,
      '\nВы можете посетить разные места в городе. Используйте кнопки для этого.'
      ]
    })
  }
}
