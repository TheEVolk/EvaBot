async function timerCallback (gameSessions, pet, v, redisPlugin) {
  const owner = await pet.getOwner()
  const force = Math.floor(Math.random() * 10)

  pet.force += force
  pet.save()

  owner.send([
    `🏈 Вы поиграли с питомцем.`,
    `➕ ${pet.force} ед. силы питомцу.`
  ])

  gameSessions.splice(gameSessions.indexOf(v), 1)
  redisPlugin.setObject('pet:gameSessions', gameSessions)
}

module.exports = async function ({ getPlugin }) {
  const redisPlugin = getPlugin('common/redis')
  const gameSessions = await redisPlugin.getObject('pet:gameSessions') || []

  return {
    run: async (pet) => {
      const v = { petId: pet.id, startAt: Date.now() }
      gameSessions.push(v)
      setTimeout(
        timerCallback,
        300000,
        gameSessions,
        await this.getPetById(pet.id),
        v,
        redisPlugin
      )

      redisPlugin.setObject('pet:gameSessions', gameSessions)
    },

    get: (pet) => gameSessions.find(v => v.petId === pet.id),

    start: () => {
      gameSessions.forEach(async v => {
        console.log(v)
        setTimeout(
          timerCallback,
          v.startAt + 300000 - Date.now(),
          gameSessions,
          await this.getPetById(v.petId),
          v,
          redisPlugin
        )
      })
    }
  }
}
