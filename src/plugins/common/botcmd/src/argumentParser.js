import loadDefaultTypes from './defaultTypes';

export default class ArgumentParser {
  constructor(henta, botcmd) {
    Object.assign(this, {
      henta,
      botcmd,
      types: {},
      allowNullTypes: new Set()
    });
  }

  init() {
    loadDefaultTypes(this);
  }

  add(slug, handler) {
    if (this.types[slug]) {
      throw Error(`Тип '${slug}' уже существует.`);
    }

    this.types[slug] = handler;
    return this;
  }

  allowNull(slug) {
    this.allowNullTypes.add(slug);
  }

  getFunction(slug) {
    const func = this.types[slug];
    if (!func) {
      throw Error(`Сущность ${slug} не существует.`);
    }

    return func;
  }

  async parse(ctx, argList, offset) {
    let index = 0;
    const params = new Map();
    for (const [name, argument] of Object.entries(argList)) {
      // Optional arguments
      console.log(name, argument)
      if (ctx.args.length - 1 - offset <= index) {
        if (!this.allowNullTypes.has(argument.type)) {
          if (argument.optional) {
            continue;
          } else {
            return [true, [
              '⚪ Используйте:',
              `>> ${Object.values(argList).map(v => (v.optional ? `[${v.name}]` : `<${v.name}>`)).join(' ')}`
            ]];
          }
        }
      }

      const func = this.getFunction(argument.type);
      const [error, result] = await func({
        ctx,
        index,
        argument,
        word: ctx.args[index + 1 + offset],
        setIndex: newIndex => { index = newIndex; }
      });
      console.log(error, result)

      if (error) {
        if (argument.optional) {
          continue;
        }

        return [error, result];
      }

      index++;
      if (result === undefined && !argument.optional) {
        return [true, `Вы не указали аргумент: ${argument.name}`]
      }

      params.set(name, result);
    }

    return [false, Object.fromEntries(params)];
  }
}
