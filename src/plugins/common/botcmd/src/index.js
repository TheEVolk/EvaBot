import ArgumentParser from './argumentParser'
import loadCommands from './commandLoader'

export default class {
  constructor (henta) {
    Object.assign(this, {
      henta,
      argumentParser: new ArgumentParser(henta, this),
      aliases: {}
    })
  }

  async init (henta) {
    this.argumentParser.init()

    const { messageProcessor } = henta.getPlugin('common/bot')
    messageProcessor.handlers.set('command', this.handler.bind(this))

    this.commands = await loadCommands(henta)
    this.commands.forEach(command => {
      this.aliases[command.name] = command
      if (command.aliases) {
        command.aliases.forEach(v => { this.aliases[v] = command })
      }
    })
  }

  get (commandName) {
    return this.aliases[commandName.toLowerCase()]
  }

  checkPex (ctx, right, errStr) {
    if (!right) {
      return true
    }

    console.log('ctx.user.pex.is(right) ', right, ctx.user.pex.is(right))
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

    const commandArgs = commandLine.split(' ')
    const commandName = commandArgs[0]

    const command = this.get(commandName)
    if (!command) {
      return next()
    }

    if (!this.checkPex(ctx, command.right)) {
      return next()
    }

    ctx.args = commandArgs
    if (command.arguments) {
      const [error, res] = await this.argumentParser.parse(ctx, command.arguments, 0)
      if (error) {
        ctx.answer((command.errors && command.errors[res]) || res)
        return next()
      }

      ctx.params = res
    }

    await command.handler(ctx)
    await next()
  }
}
