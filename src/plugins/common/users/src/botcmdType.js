export default function initType (plugin) {
  const { argumentParser } = plugin.henta.getPlugin('common/botcmd')

  // User
  argumentParser.add('user', async (data) => {
    const value = await plugin.resolve(data.word)
    if (!value) {
      return [true, '🎎 Игрок не существует или не пользуется ботом.']
    }

    if (data.argument.notSelf && value === data.ctx.user) {
      return [true, '🎎 Нельзя указывать самого себя']
    }

    return [false, value]
  })
}
