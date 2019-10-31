import loadDefaultTypes from './defaultTypes'

export default class ArgumentParser {
  constructor (henta, botcmd) {
    Object.assign(this, {
      henta,
      botcmd,
      types: {}
    })
  }

  init () {
    loadDefaultTypes(this)
  }

  add (slug, handler) {
    if (this.types[slug]) {
      throw Error(`Тип '${slug}' уже существует.`)
    }

    this.types[slug] = handler
  }

  getFunction (slug) {
    const func = this.types[slug]
    if (!func) {
      throw Error(`Сущность ${slug} не существует.`)
    }

    return func
  }

  async parse (ctx, argList, offset) {
    if (Object.values(argList).filter(v => !v.optional).length > ctx.args.length - 1 - offset) {
      return [true, '⚪ Недостаточно аргументов.']// 'error:commandUse']
    }

    let index = offset
    const params = new Map()
    for (const [name, argument] of Object.entries(argList)) {
      // Optional arguments
      if (ctx.args.length <= index) {
        break
      }

      const func = this.getFunction(argument.type)
      const [error, result] = await func({
        ctx,
        index,
        argument,
        word: ctx.args[index + 1],
        setIndex: (newIndex) => { index = newIndex }
      })

      if (error) {
        return [error, result]
      }

      index++
      params.set(name, result)
    }

    return [false, Object.fromEntries(params)]
  }
}