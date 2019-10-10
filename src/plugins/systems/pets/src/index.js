class PetsPlugin {
  constructor (henta) {
    Object.assign(this, {
      henta,
      petPrototype: {},
      types: require(`${henta.botdir}/petTypes.json`),
      typesFromTags: {}
    })

    this.types.forEach(v => { this.typesFromTags[v.tag] = v })
  }

  async init (henta) {
    require('./userMethods').call(this, henta)
    require('./petMethods').call(this, henta)

    this.imageGenerator = await require('./imageGenerator').call(this, henta)
    this.shelter = await require('./shelter').call(this, henta)
    this.play = await require('./play').call(this, henta)
    this.duel = await require('./duel').call(this, henta)
    this.messages = await require('./messages').call(this, henta)
  }

  async start (henta) {
    await require('./modelPet').call(this, henta)
    this.play.start()
    this.duel.start()
  }

  getPetTypeByName (typeNameStr) {
    const typeName = typeNameStr.toLowerCase()

    return this.types.find(v => {
      return typeName === v.name.toLowerCase() ||
        typeName === v.femaleName.toLowerCase()
    })
  }

  async createPet (petInfo) {
    this.henta.log(`Новый питомец: ${petInfo.name}`)
    return this.Pet.create(petInfo)
  }

  async getPetById (id) {
    return this.Pet.findOne({ where: { id } })
  }

  addMethod (methodName, func) {
    this.petPrototype[methodName] = function (...args) { return func(this, ...args) }
  }
}

module.exports = PetsPlugin
