const Sequelize = require('sequelize')

class ClansPlugin {
  constructor (henta) {
    this.henta = henta
    this.clanPrototype = {}
  }

  init (henta) {
    require('./userMethods').call(this, henta)
    require('./oopMethods').call(this, henta)
    require('./requests').call(this, henta)
    require('./argumentType').call(this, henta)
  }

  async start ({ getPlugin }) {
    const dbPlugin = getPlugin('common/db')
    this.Clan = dbPlugin.define('clan', {
      name: Sequelize.STRING,
      slots: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
      chatId: Sequelize.INTEGER,
      wins: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      defeats: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      ownerVkId: Sequelize.INTEGER,
      isClosed: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
    }, { timestamps: false })
    await dbPlugin.safeSync(this.Clan)

    this.ClanMember = dbPlugin.define('clanMember', {
      vkId: Sequelize.INTEGER,
      clanId: Sequelize.INTEGER
    }, { timestamps: false })
    await dbPlugin.safeSync(this.ClanMember)
  }

  async createClan (clanInfo) {
    const clan = await this.Clan.create(clanInfo)

    this.henta.log(`Новый клан: ${clan.name} (№${clan.id})`)
    await this.ClanMember.create({ vkId: clan.ownerVkId, clanId: clan.id })

    Object.assign(Object.getPrototypeOf(clan), this.clanPrototype)
    return clan
  }

  async getClanById (clanId) {
    const clan = await this.Clan.findOne({ where: { id: clanId } })
    if (!clan) return null
    Object.assign(Object.getPrototypeOf(clan), this.clanPrototype)
    return clan
  }

  addMethod (methodName, func) {
    this.clanPrototype[methodName] = function (...args) { return func(this, ...args) }
  }
}

module.exports = ClansPlugin
