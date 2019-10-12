export default async function initBotcmdType (plugin) {
  const { argumentParser } = plugin.henta.getPlugin('common/botcmd')

  // User
  argumentParser.add('moneys', (data) => {
    const value = parseInt(data.word)

    if (value > data.ctx.user.money) {
      return [true, '⛔ Недостаточно бит.']
    }

    return [false, value]
  })
}
