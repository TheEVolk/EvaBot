import { Keyboard } from 'vk-io'

class SActions {
  name = 'действия'

  async handler (ctx) {
    await ctx.user.assertPet(ctx, 'have')

    ctx.builder()
      .text('🔑 Список доступных действий:')
      .keyboard(Keyboard.builder()
        .textButton({ label: `🏈 Играть`, payload: { command: 'пит играть' } })
        .row()
        .textButton({ label: 'Назад', payload: { command: 'пит' } })
      )
      .answer({ mainMenuRow: false })
  }
}

export default class {
  name = 'пит'
  description = 'твой питомец'
  emoji = '🐾'
  subcommands = [SActions]

  async handler (ctx) {
    ctx.builder()
      .photo('res/img/indev.png')
      .answer()
  }
}

/*
  async topHandler (ctx) {
    const { Pet } = ctx.getPlugin('systems/pets')
    const myPet = await ctx.user.getPet()

    const emoji = ['', '🥇', '🥈', '🥉', '🏅', '🏅']
    const pets = await Pet.findAll({ order: [['rating', 'DESC']], limit: 5 })

    ctx.answer([
      '📊 Топ 5 питомцев:',
      ctx.printList(pets, (v, i) => `>> ${emoji[i]} [id${v.ownerVkId}|${v.name}] - ${v.rating} ед`),
      myPet
        ? `\n🔼 Ваш питомец №${await Pet.count({ where: { rating: { [Op.gte]: myPet.rating } } })} в топе!`
        : null
    ])
  }

  async playHandler (ctx) {
    const { play } = ctx.getPlugin('systems/pets')
    const pet = await ctx.user.assertPet(ctx, 'has')

    const gameSession = play.get(pet)
    if (gameSession) {
      return ctx.builder()
        .text(`⏳ До конца игры ${formatDistanceToNow(gameSession.startAt + 300000, { locale: ru })}.`)
        .botcmdButton('Назад', 'пит', 'secondary')
        .answer()
    }

    play.run(pet)

    ctx.builder()
      .lines([
        `🏈 Вы начали играть с ${pet.name}.`,
        '⏳ Это займёт 5 минут реального времени.'
      ])
      .botcmdButton('Назад', 'пит', 'secondary')
      .answer()
  }

  async duelHandler (ctx) {
    const { play, duel, messages } = ctx.getPlugin('systems/pets')
    const pet = await ctx.user.assertPet(ctx, 'has')
    const petType = pet.getType()

    ctx.assert(!play.get(pet), messages.busyErrorGame)
    ctx.assert(!duel.get(pet), messages.busyErrorDuel)

    const { tip } = ctx.params.enemy.createRequest({
      tag: 'pets:duel',
      text: [
        `${ctx.user.r()} вызывает вашего питомца на дуэль.`,
        '',
        `${petType.emoji} ${petType.name} «${pet.name}»:`,
        `⠀⠀✨ Рейтинг: ${pet.rating} ед;`,
        `⠀⠀⚡ Сила: ${pet.force} ед;`
      ].join('\n'),
      peer: ctx.msg.peer_id
    }, ctx.user)

    ctx.builder()
      .lines([`💥 Вы отправили ${ctx.params.enemy.r()} заявку на дуэль.`, tip])
      .botcmdButton('Назад', 'пит', 'secondary')
      .answer()
  }
*/
