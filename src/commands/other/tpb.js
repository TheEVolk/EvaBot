export default class {
  constructor () {
    Object.assign(this, {
      name: 'тпб',
      description: 'список тех. персонала',
      emoji: '🕶'
    })
  }

  async handler (ctx) {
    const usersPlugin = ctx.getPlugin('common/users')

    const mainAdmin = await usersPlugin.User.findOne({ where: { role: 'mainAdministrator' } })
    const admins = await usersPlugin.User.findAll({ where: { role: 'administrator' } })
    const moders = await usersPlugin.User.findAll({ where: { role: 'moderator' } })

    ctx.answer([
      '🕶 [evabottp|Техническая поддержка].',
      '⬛ Главный администратор:',
      `>> ${mainAdmin.emoji} ${mainAdmin.r()}.`,
      '⬛ Администрация:',
      ...admins.map(v => `>> ${v.emoji} ${v.r()};`),
      '⬛ Модерация:',
      ...moders.map(v => `>> ${v.emoji} ${v.r()};`)
    ])
  }
}
