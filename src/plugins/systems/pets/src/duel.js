const DuelWorker = require('./duelWorker')

async function denyHandler (ctx, { source }) {
  source.send(`❌ ${ctx.user.r()} отклонил вашу заявку в дуэль.`)
  ctx.answer(`⭕ Заявка на дуэль с ${source.r()} отклонена.`)
}

async function acceptHandler (ctx, { source, peers }) {
  const pet = await ctx.user.assertPet(ctx, 'has')
  const enemyPet = await ctx.assert(await source.getPet(), `❌ У оппонента нет питомца.`)

  ctx.assert(!this.play.get(pet), this.messages.busyErrorGame)
  ctx.assert(!this.duel.get(pet), this.messages.busyErrorDuel)
  ctx.assert(!this.play.get(enemyPet), `❌ Питомец оппонента занят игрой.`)
  ctx.assert(!this.duel.get(enemyPet), `❌ Питомец оппонента занят дуэлью.`)

  const worker = new DuelWorker(this, {
    petIds: [ pet.id, enemyPet.id ],
    healths: [ 100, 100 ],
    peers: peers
  })

  worker.start()
  this.duel.duelSessions.add(worker)

  source.send([`🔥 ${pet.name} VS ${enemyPet.name}.`, `⚡ Бой начался!`])
  ctx.answer([`🔥 ${pet.name} VS ${enemyPet.name}.`, `⚡ Бой начался!`])
}

module.exports = async function ({ getPlugin }) {
  const redisPlugin = getPlugin('common/redis')
  const duelSessions = new Set()

  getPlugin('common/requests').addTag(
    'pets:duel', 
    acceptHandler.bind(this), 
    denyHandler.bind(this)
  )

  process.on('SIGINT', () => {
    redisPlugin.setObject('pets:duelSessions', Array.from(duelSessions).map(v => v.getData()))
  })

  return {
    duelSessions,

    get: (pet) => Array.from(duelSessions).find(v => v.petIds.includes(pet.id)),

    start: async () => {
      const sessionSaves = await redisPlugin.getObject('pets:duelSessions')
      if (!sessionSaves) {
        return
      }

      sessionSaves.map(v => new DuelWorker(this, v))
        .forEach(v => duelSessions.add(v))
        
      duelSessions.forEach(v => v.start())
    }
  }
}
