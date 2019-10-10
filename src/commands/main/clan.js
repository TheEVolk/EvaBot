export default class {
  name = 'клан'
  description = 'клановая система'
  emoji = '🛡'

  async handler (ctx) {
    ctx.builder()
      .photo('res/img/indev.png')
      .answer()
  }
}
/*
export default class {
  constructor () {
    Object.assign(this, {
      name: 'клан',
      description: 'система кланов',
      emoji: '🛡',
      subcommands: {
        управление: { handler: this.manageHandler },
        режим: { handler: this.modeHandler },
        вступить: {
          handler: this.joinHandler,
          arguments: { clan: { name: 'клан', type: 'clan' } }
        },
        создать: {
          handler: this.createHandler,
          arguments: { name: { name: 'имя клана', type: 'string' } }
        },
        инфо: {
          handler: this.infoHandler,
          arguments: { clan: { name: 'клан', type: 'clan' } }
        },
        участники: {
          handler: this.membersHandler,
          arguments: { clan: { name: 'клан', type: 'clan' } }
        }
      },
      type: 'main'
    })
  }

  async handler (ctx) {
    const clan = ctx.assert(
      await ctx.user.getClan(),
      {
        message: [
          '🛡 Вы не состоите ни в каком клане.',
          '➤ vk.com/@evarobotgroup-clans'
        ],
        keyboard: ctx.keyboard().oneTime(true)
          .textButton({
            label: '📥 Вступить',
            payload: {
              sbs: {
                type: 'botcmd',
                command: 'клан вступить',
                titles: ['Введите ID клана, в который вы хотите вступить:']
              }
            }
          })
          .textButton({
            label: '🖋 Создать',
            payload: {
              sbs: {
                type: 'botcmd',
                command: 'клан создать',
                titles: ['Введите название вашего нового клана:']
              }
            }
          })
      }
    )

    await this.infoHandler(Object.assign(ctx, { params: { clan } }))
  }

  async joinHandler (ctx) {
    await ctx.user.assertClan(ctx, 'free')
    const clan = ctx.params.clan
    ctx.assert(!clan.isClosed, '🔒 Это закрытый клан. Попасть в него можно только по приглашению.')

    const clanOwner = await clan.getOwner()
    const { tip } = clanOwner.createRequest({
      tag: 'join_a_clan',
      text: `${ctx.user.r()} хочет вступить в ваш клан.`
    }, ctx.user)

    ctx.answer([
      '✅ Вы подали заявку в клан:',
      `🛡 «${clan.name}» №${clan.id}.`,
      tip
    ])
  }

  async createHandler (ctx) {
    await ctx.user.assertClan(ctx, 'free')
    ctx.user.buy(ctx, 1e7)

    const clan = await ctx.getPlugin('mybot/systems').createClan({
      name: ctx.params.name,
      ownerVkId: ctx.user.vkId
    })

    ctx.send([
      '✅ Вы успешно создали клан.',
      '➤ Информация о нём появится в следующем сообщении.'
    ])

    ctx.user.acceptBuy(ctx)
    await this.infoHandler(Object.assign(ctx, { params: { clan } }))
  }

  async infoHandler (ctx) {
    const clan = ctx.params.clan
    ctx.answer({
      message: [
        `🛡 Клан «${clan.name}» №${clan.id}:`,
        `👤 Владелец: ${(await clan.getOwner()).r()};`,
        `👥 Участников: ${await clan.getMembersCount()}/${clan.slots} чел.`,
        clan.isClosed ? '🔒 Закрытый клан;' : '🔓 Открытый клан;',
        `☠ KD клана: ${clan.getKd()} (${clan.wins}/${clan.defeats});`,
        `🥇 Место в топе: ${await clan.getTopPosition()}.`
      ],
      keyboard: ctx.keyboard()
        .textButton({ label: '🔑 Управление', color: 'primary', payload: { botcmd: 'клан управление' } })
        .textButton({ label: '🛡 Меню кланов', color: 'primary', payload: { botcmd: 'клан меню' } })
    })
  }

  async manageHandler (ctx) {
    const clan = await ctx.user.assertClan(ctx, 'owner')
    ctx.answer({
      message: [
        `🔑 Управление «${clan.name}» №${clan.id}:`,
        '➤ Используйте кнопки для навигации.'
      ],
      keyboard: ctx.keyboard()
        .textButton({
          label: clan.isClosed ? '🔒 Открыть клан' : '🔓 Закрыть клан',
          color: 'primary',
          payload: { botcmd: 'клан режим' }
        }).row()
        .textButton({
          label: `👥 ${await clan.getMembersCount()} участников`,
          color: 'primary',
          payload: { botcmd: `клан участники ${clan.id}` }
        }).row()
        .textButton({ label: '🔙 Назад', payload: { botcmd: 'клан' } })
    }, { mainMenu: false })
  }

  async modeHandler (ctx) {
    const clan = await ctx.user.assertClan(ctx, 'owner')
    clan.isClosed = !clan.isClosed
    clan.save()

    ctx.answer({
      message: [
        clan.isClosed ? '🔒 Вы закрыли клан.' : '🔓 Вы открыли клан.',
        clan.isClosed
          ? '\nТеперь в него можно попасть только по приглашению.'
          : '\nТеперь любой желающий может подать заявку на вступление в клан.'
      ],
      keyboard: ctx.keyboard().textButton({ label: '🔙 Назад', payload: { botcmd: 'клан управление' } })
    }, { mainMenu: false })
  }

  async membersHandler (ctx) {
    const clan = ctx.params.clan
    const clanMembers = await clan.getMembers()

    ctx.answer({
      message: [
        `👥 Участники «${clan.name}» №${clan.id}:`,
        ...clanMembers.map((v, i, { length }) => `${i + 1}. ${v.r()}${i === length - 1 ? '.' : ';'}`)
      ],
      keyboard: ctx.keyboard().textButton({ label: '🔙 Назад', payload: { botcmd: 'клан' } })
    }, { mainMenu: false })
  }
}
*/
