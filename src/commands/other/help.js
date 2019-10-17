export default class HelpCommand {
  name = 'помощь'
  aliases = ['команды', 'хелп']
  description = 'список команд'
  emoji = '❔'

  printCategory (all, category) {
    const commands = all.filter(v => v.type === category.slug)

    return [
      category.title + ':',
      ...commands.map(v => this.printCommand(v))
    ].join('\n')
  }

  printCommand (command) {
    return `⠀⠀${command.emoji || '📛'} ${command.name} — ${command.description}.`
  }

  handler (ctx) {
    const botcmdPlugin = ctx.getPlugin('common/botcmd')
    const commandTypes = [
      { slug: 'main', title: '💎 Основные' },
      { slug: 'shop', title: '🛍 Магазины' },
      { slug: 'games', title: '🎲 Миниигры' },
      { slug: 'other', title: '⬛ Разное' },
      { slug: 'tools', title: '🛠 Утилиты' }
    ]

    const allCommands = botcmdPlugin.commands
      .filter(v => !v.private)
      .filter(v => !v.right || ctx.user.pex.is(v.right))

    ctx.builder()
      .lines(commandTypes.map(v =>
        this.printCategory(allCommands, v)
      ))
      .answer()
  }
}
