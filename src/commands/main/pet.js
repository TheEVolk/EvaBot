import { Keyboard } from 'vk-io'
import { Op } from 'sequelize'

class OtherSubcommand {
  name = 'прочее'

  handler (ctx) {
    ctx.builder()
      .text('⬜ Используйте кнопки для навигации.')
      .keyboard(Keyboard.builder()
        .textButton({ label: `Топ`, payload: { command: 'пит топ' } })
        .row()
        .textButton({ label: `Назад`, payload: { command: 'пит' } })
        .oneTime()
      )
      .answer()
  }
}

class TopSubcommand {
  name = 'топ'

  async handler (ctx) {
    const { Pet } = ctx.getPlugin('systems/pets')

    const myPet = await ctx.user.pets.get()
    const myPetPos = myPet && await Pet.count({ where: { rating: { [Op.gte]: myPet.rating } } })

    const pets = await Pet.findAll({ order: [['rating', 'DESC']], limit: 5 })

    ctx.builder()
      .text('📊 Топ 5 питомцев:')
      .lines(pets.map(
        (v, i) => `${i + 1}⃣ [id${v.ownerVkId}|${v.name}]\n— ${v.rating} ед.`
      ))
      .line(myPet && `\n🔼 Ваш №${myPetPos} в топе!`)
      .keyboard(Keyboard.builder()
        .textButton({ label: `Назад`, payload: { command: 'пит' } })
        .oneTime()
      )
      .answer()
  }
}

export default class PetCommand {
  name = 'пит'
  description = 'твой питомец'
  emoji = '🐾'
  subcommands = [
    new OtherSubcommand(),
    new TopSubcommand()
  ]

  async handler (ctx) {
    if (!ctx.user.pex.is('indev')) {
      return ctx.builder()
        .photo('res/img/indev.png')
        .answer()
    }

    const pet = await ctx.user.pets.get()
    
    ctx.builder()
      .lines([
        `${pet.kind.emoji} ${pet.name}`,
        `✨ Рейтинг: ${pet.rating} ед.`,
        `⚡ Сила: ${pet.force} ед.`
      ])
      .keyboard(Keyboard.builder()
        .textButton({ label: `Прочее`, payload: { command: 'пит прочее' } })
        .oneTime()
      )
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
