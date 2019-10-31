import Sequelize from 'sequelize'

export default class PetsPlugin {
  constructor (henta) {
    this.henta = henta
  }

  async init (henta) {
    this.kinds = await henta.util.loadSettings('pets/kinds.json')
    this.kindsFromSlug = Object.fromEntries(this.kinds.map(v => [v.slug, v]))
    this.initUser()
    this.initPetModel()
  }

  async initPetModel () {
    const dbPlugin = this.henta.getPlugin('common/db')
    this.Pet = dbPlugin.define('pet', {
      name: Sequelize.STRING,
      type: Sequelize.STRING,
      ownerVkId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      variety: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      force: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      rating: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
    }, { timestamps: false })

    await dbPlugin.safeSync(this.Pet)
    this.initPetPrototype(this.Pet.prototype, this)
  }

  initPetPrototype (petPrototype, plugin) {
    // Костыли :/
    Object.defineProperty(this.Pet.prototype, 'kind', { get: function () {
      return plugin.getKind(this.type)
    }})
  }

  initUser () {
    const usersPlugin = this.henta.getPlugin('common/users')

    usersPlugin.group('pets')
      .method('get', ({ vkId: ownerVkId }) =>
        this.Pet.findOne({ where: { ownerVkId } })
      )
      .end()
  }

  getKind (slug) {
    return this.kindsFromSlug[slug]
  }
}
