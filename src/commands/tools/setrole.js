export default class {
  constructor (henta) {
    Object.assign(this, {
      name: 'сетроль',
      arguments: {
        target: { name: 'игрок', type: 'user' },
        role: { name: 'роль', type: 'string', optional: true }
      },
      type: 'tools',
      right: 'setrole'
    })
  }

  async handler (ctx) {
    const newRole = ctx.params.role || 'user'
    ctx.assert(
      ctx.getPlugin('common/roles').roles[newRole],
      '⛔ Такой роли не существует.'
    )

    const oldRoleName = ctx.params.target.getRoleName()
    ctx.params.target.role = newRole
    ctx.params.target.save()

    ctx.params.target.send([
      '🎫 Новая роль:',
      `⬛ ${oldRoleName} » ${ctx.params.target.getRoleName()}.`
    ])
    ctx.answer([
      `🎫 Новая роль для ${ctx.params.target.r()}:`,
      `⬛ ${oldRoleName} » ${ctx.params.target.getRoleName()}.`
    ])
  }
}
