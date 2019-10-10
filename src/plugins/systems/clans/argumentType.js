module.exports = function ({ getPlugin }) {
  const botcmdPlugin = getPlugin('common/botcmd')

  botcmdPlugin.addArgumentType('clan', async data => {
    const clanId = data.ctx.assert(Number(data.arg), '⛔ Используйте ID клана')
    return data.ctx.assert(
      await this.getClanById(clanId),
      '⛔ Клан с таким ID не найден'
    )
  })
}
