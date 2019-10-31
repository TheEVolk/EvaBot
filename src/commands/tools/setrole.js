export default class SetRoleCommand {
  name = 'сетроль'
  description = 'изменить роль'
  emoji = '🔐'
  right = 'set-role'
  arguments = {
    target: { name: 'пользователь', type: 'user' },
    role: { name: 'роль', type: 'string', optional: true }
  }

  async handler (ctx) {
    const newRoleSlug = ctx.params.role || 'user'
    const newRole = ctx.getPlugin('common/pex').get(newRoleSlug)
    if (!newRole) {
      return ctx.answer('⛔ Такой роли не существует.')
    }

    const oldRoleName = ctx.params.target.pex.get().name
    ctx.params.target.role = newRoleSlug
    ctx.params.target.save()

    ctx.params.target.send([
      `🎫 ${ctx.user} изменил вашу роль:`,
      `⬛ ${oldRoleName} » ${newRole.name}.`
    ])

    ctx.answer([
      `🎫 Новая роль для ${ctx.params.target}:`,
      `⬛ ${oldRoleName} » ${newRole.name}.`
    ])
  }
}
