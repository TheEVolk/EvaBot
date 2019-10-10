const Sequelize = require('sequelize')

class MilkUserPlugin {
  constructor (henta, ctx) {
    this.henta = henta
  }

  init ({ botdir, getPlugin, log }) {
    const fields = require(`${botdir}/milkuser.json`)
    const usersPlugin = getPlugin('common/users')
    fields.forEach(f => {
      f.params.type = eval(`Sequelize.${f.params.type}`)
      f.params.defaultValue = f.params.defaultValueFunc ? eval(f.params.defaultValueFunc) : f.params.defaultValue
      usersPlugin.addModelField(f.name, f.params)
    })

    log(`Добавлено ${fields.length} пользовательских полей.`)
  }
}

module.exports = MilkUserPlugin
