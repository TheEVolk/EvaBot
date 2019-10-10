const nodeCanvas = require('canvas')

nodeCanvas.registerFont('./res/font/bork-display.otf', { family: 'Bork Display' })

export default class {
  constructor () {
    Object.assign(this, {
      name: 'приют',
      description: 'здесь можно найти питомца',
      emoji: '🌷',
      subcommands: {
        забрать: { handler: this.takeHandler },
        искать: {
          handler: this.findHandler,
          arguments: { name: { name: 'название', type: 'string' } }
        }
      }
    })
  }

  async handler (ctx) {
    await ctx.user.assertPet(ctx, 'free')
    const petTypes = ctx.getPlugin('systems/pets').types

    ctx.builder()
      .lines([
        '🌷 Какого питомца вы хотите?',
        ...ctx.printList(petTypes, (v) => `⠀⠀${v.emoji} ${v.femaleName}`)
      ])
      .buttonsList(petTypes.map(v => ({
        label: `${v.emoji} ${v.femaleName}`,
        payload: { botcmd: `приют искать ${v.femaleName}` }
      })))
      .answer()
  }

  async findHandler (ctx) {
    const petsPlugin = ctx.getPlugin('systems/pets')

    await ctx.user.assertPet(ctx, 'free')

    const petType = ctx.assert(
      petsPlugin.getPetTypeByName(ctx.params.name),
      {
        message: '⛔ Вид с таким именем не существует',
        keyboard: ctx.keyboard().textButton({
          label: '🌷 В приют',
          payload: { botcmd: 'приют' },
          color: 'primary'
        })
      }
    )

    const pet = await petsPlugin.shelter.generate(ctx.user.vkId, petType)

    ctx.builder()
      .lines([
        `${petType.emoji} ${pet.sex ? petType.femaleName : petType.name} «${pet.name}»:`,
        `💲 Цена: ${ctx.getPlugin('mybot/moneys').briefNumber(pet.price)} бит.`
      ])
      .attach(await petsPlugin.imageGenerator.get(pet))
      .textButton({ label: '✔ Забрать', payload: { botcmd: 'приют забрать' }, color: 'positive' })
      .textButton({ label: '➡ Следующий', payload: { botcmd: `приют искать ${petType.name}` } })
      .answer()
  }

  async takeHandler (ctx) {
    await ctx.user.assertPet(ctx, 'free')

    const petsPlugin = ctx.getPlugin('systems/pets')
    const pet = await petsPlugin.shelter.buy(ctx)

    const { canvas, context } = await pet.generateImage()

    const smilePos = pet.getType().varieties[pet.variety].smile
    context.drawImage(
      await nodeCanvas.loadImage('./res/img/pets/smile.png'),
      pet.type === 'cat' ? smilePos.x - smilePos.size / 2 : smilePos.x,
      pet.type === 'cat' ? smilePos.y - smilePos.size / 2 : smilePos.y - smilePos.size,
      smilePos.size,
      smilePos.size
    )

    ctx.user.acceptBuy(ctx)

    ctx.builder()
      .lines([
        `✔ Вы купили «${pet.name}»:`,
        'Посмотрите как он счастлив.'
      ])
      .attachCanvas(canvas)
      .textButton({ label: `${pet.getType().emoji} К питомцу`, payload: { botcmd: 'пит' }, color: 'positive' })
      .answer()
  }
}
