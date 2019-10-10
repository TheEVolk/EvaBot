export default class {
  constructor () {
    Object.assign(this, {
      name: 'помощь',
      aliases: ['команды', 'хелп'],
      emoji: '❔',
      description: 'список команд',
      subcommands: {
        категория: {
          handler: this.categoryHandler,
          arguments: { slug: { name: 'название', type: 'string' } }
        }
      }
    })
  }

  categoryHandler (ctx) {
    const botcmdPlugin = ctx.getPlugin('common/botcmd')
    const commands = botcmdPlugin.commands
      .filter(i => i.type === ctx.params.slug)

    const printCommand = (cmd) => {
      const args = cmd.arguments ? Object.values(cmd.arguments) : null
      const useText = args ? args.map(v => v.optional ? '[' + v.name + ']' : '<' + v.name + '>').join(' ') : ''
      return `⠀⠀${cmd.emoji || '🔵'} ${cmd.name} ${useText === ' ' ? '' : useText}\n⠀⠀↳ ${cmd.description}`
    }

    ctx.builder()
      .lines([
        '📃 Список команд:',
        ctx.printList(commands, printCommand)
      ])
      .answer()
  }

  handler (ctx) {
    if (ctx.isChat()) {
      return ctx.answer([
        '💢 Используйте эту команду только в ЛС:',
        '>> vk.me/bot_eva'
      ])
    }

    const commandTypes = [
      { slug: 'main', title: '💎 Основные' },
      { slug: 'shop', title: '🛍 Магазины' },
      { slug: 'games', title: '🎲 Миниигры' },
      { slug: 'other', title: '⬛ Разное' },
      { slug: 'tools', title: '🛠 Утилиты' }
    ]

    ctx.builder()
      .lines([
        '📃 Категории команд:',
        ctx.printList(commandTypes, v => `⠀⠀${v.title}`)
      ])
      .buttonsList(commandTypes.map(v => ({
        label: v.title,
        payload: { botcmd: `помощь категория ${v.slug}` }
      })))
      .answer()
  }
}

/*
      handler(ctx) {
        const categories = [
            { title: '📓 Основные:', tag: 'main' },
            { title: '🗂 Прочие:', tag: 'other' }
        ]

        const botcmdPlugin = ctx.getPlugin('common/botcmd')

        const printCommand = (cmd) => {
            const args = cmd.arguments ? Object.values(cmd.arguments) : null;
            const useText = args ? args.map(v => v.optional ? '['+v.name+']' : '<'+v.name+'>').join(' ') : '';
            return `⠀⠀${cmd.emoji || '🔵'} ${cmd.name} ${useText == ' ' ? '' : useText}\n⠀⠀↳ ${cmd.description}`;
        }

        const printCategory = (category) => {
            const commands = botcmdPlugin.commands
              .filter(i => i.type === category.tag)

            return [
                `${category.title}`,
                ...commands.map(printCommand)
            ].join('\n')
        }

        ctx.answer([
            'список команд бота:',
            ...categories.map(printCategory)
        ])
    } */
