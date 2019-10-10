const Sequelize = require('sequelize')

class RolesPlugin {
  constructor (henta) {
    this.henta = henta
  }

  init ({ botdir, getPlugin, hookManager }) {
    this.roles = require(`${botdir}/roles.json`)

    const usersPlugin = getPlugin('common/users')
    usersPlugin.addModelField('role', { type: Sequelize.STRING, allowNull: false, defaultValue: 'user' })
    usersPlugin.addMethod('isCan', (self, right) => this.isUserCan(self, right))
    usersPlugin.addMethod('getRoleName', (self) => this.roles[self.role].title)
    usersPlugin.addMethod('getRoleValue', (self, value) => this.roles[self.role].data.values[value])
  }

  onRunCommand (ctx) {
    if (!ctx.cmdSettings.right) return
    ctx.assert(
      ctx.user.isCan(`command:${ctx.cmdSettings.right}`),
      ctx.cmdSettings.rightErr || '⛔ У вас недостаточно прав.'
    )
  }

  isUserCan (user, right) {
    return this.isRoleCanByName(user.role, right)
  }

  isRoleCanByName (roleName, right) {
    return this.isRoleCan(this.roles[roleName], right)
  }

  isRoleCan (role, right) {
    if (role.data.disallow && role.data.disallow.includes(right))
      return false

    if (role.data.allow == true) return true
    return role.data.allow && role.data.allow.includes(right)
  }
}

module.exports = RolesPlugin
