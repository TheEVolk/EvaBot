const Sequelize = require('sequelize')

module.exports = async function ({ getPlugin }) {
  const dbPlugin = getPlugin('common/db')
  this.Pet = dbPlugin.define('pet', {
    name: Sequelize.STRING,
    type: Sequelize.STRING,
    ownerVkId: Sequelize.INTEGER,
    variety: Sequelize.INTEGER,
    force: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    rating: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
  }, { timestamps: false })
  await dbPlugin.safeSync(this.Pet)

  Object.assign(this.Pet.prototype, this.petPrototype)
}
