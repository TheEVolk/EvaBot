import ArgumentParser from './argumentParser.js'
import CommandLoader from './commandLoader.js'

export default class BotCmdPlugin {
  constructor (henta) {
    Object.assign(this, {
      henta,
      argumentParser: new ArgumentParser(henta, this)
    })

    this.loader = new CommandLoader(this)
  }

  async init (henta) {
    this.argumentParser.init()

    const { messageProcessor } = henta.getPlugin('common/bot')
    messageProcessor.handlers.set('command', this.handler.bind(this))

    await this.loader.loadCommands()
    this.loader.initWatcher()
  }

  get (commandName) {
    return this.loader.aliases.get(commandName.toLowerCase())
  }

  getSubcommand (ctx, command) {
    if (ctx.args.length < 2) {
      return
    }

    return command.subcommandsAliases && command.subcommandsAliases[ctx.args[1]]
  }

  checkPex (ctx, right, errStr) {
    if (!right) {
      return true
    }

    if (!ctx.user.pex || !ctx.user.pex.is(right)) {
      ctx.answer(errStr || '⛔ Недостаточно прав для совершения этой операции.')
      return false
    }

    return true
  }

  async handler (ctx, next) {
    const commandLine = ctx.getPayloadValue('command') || ctx.text
    if (!commandLine) {
      return next()
    }

    ctx.args = commandLine.split(' ').filter(v => v !== 'i')
    const commandName = ctx.args[0]

    const command = this.get(commandName)
    if (!command) {
      return next()
    }

    const currentCommand = this.getSubcommand(ctx, command) || command

    if (!this.checkPex(ctx, currentCommand.right)) {
      return next()
    }

    if (currentCommand.arguments) {
      const [error, res] = await this.argumentParser.parse(
        ctx,
        currentCommand.arguments,
        command === currentCommand ? 0 : 1
      );

      if (error) {
        ctx.answer(res)
        return next()
      }

      ctx.params = res
    }

    await currentCommand.handler(ctx)
    await next()
  }
}