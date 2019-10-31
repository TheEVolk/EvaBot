export default async function initBotcmdType (plugin) {
  const { argumentParser } = plugin.henta.getPlugin('common/botcmd')

  // User
  argumentParser.add('moneys', (data) => {
    const value = parseInt(data.word)
    console.log({value})
    if (value === undefined) {
      return [true, '⛔ Похоже вы ввели лишний пробел перед числом.']
    }

    if (isNaN(value)) {
      return [true, '⛔ Вы указали не число']
    }

    if (value > data.ctx.user.money) {
      return [true, '⛔ Недостаточно бит.']
    }

    if (value < (data.min || 1)) {
      return [true, `⛔ Нельзя указывать меньше ${data.min || 1} бит.`]
    }

    return [false, value]
  })
}