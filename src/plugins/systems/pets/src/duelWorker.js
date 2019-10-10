import Markov from 'js-markov'

const variants = require('./duelVariants')
const duelImageGenerator = require('./duelImageGenerator')
const nodeCanvas = require('canvas')

nodeCanvas.registerFont('./res/font/bork-display.otf', { family: 'Bork Display' })

class DuelWorker {
  constructor(petsPlugin, data) {
    this.petsPlugin = petsPlugin
    Object.assign(this, data)
  }

  async start() {
    this.pets = await Promise.all(
      this.petIds.map(id =>
        this.petsPlugin.getPetById(id)
      )
    )

    this.createTimer()
  }

  createTimer() {
    setTimeout(
      this.duelStep.bind(this),
      Math.floor(Math.random() * 10000)
    )
  }

  async duelStep() {
    const attackerId = 1 - (this.lastAttackerId || 0)
    this.lastAttackerId = attackerId

    const attacker = this.pets[attackerId]
    const defender = this.pets[1 - attackerId]

    const isGood = attacker.force > defender.force
      ? Math.random() > 0.3
      : Math.random() > 0.6

    const damage = isGood
      ? Math.floor(Math.random() * 50)
      : 0

    this.healths[1 - attackerId] -= damage

    if (this.healths[1 - attackerId] >= 0) {
      this.createTimer()
    } else {
      this.processWin(attacker, defender)
      return
    }

    const variantLines = isGood ? variants.good : variants.bad

    const markov = new Markov()
    markov.addStates(variantLines)
    markov.train()

    let variantText = markov.generateRandom(25)

    if (!variantText.includes('&1') || !variantText.includes('&2')) {
      variantText = variantLines[Math.floor(Math.random() * variantLines.length)]
    }

    const message = [
      (isGood ? '⚡ ' : '🚼 ') + variantText.replace('&1', attacker.name).replace('&2', defender.name),
      `${defender.getType().emoji} ${defender.name}: ${this.healths[1 - attackerId]}% ${isGood ? `(➖${damage}%)` : ``}`
    ].join('\n')

    this.sendMessage(message)
  }

  async sendMessage (message) {
    this.peers.forEach(peer_id => this.petsPlugin.henta.vk.api.messages.send({ peer_id, message }))
  }

  async processWin (winner, looser) {
    // 0 - победитель ни капли не слабее, 1 - победитель во многом слабее.
    const ratingCoff = Math.min(Math.max(looser.force, 1) / Math.max(winner.force, 1), 1)
    const winnerRating = Math.floor(ratingCoff * 2000)
    const looserRating = Math.floor(ratingCoff * 2200)

    const force = Math.floor(Math.random() * 10) + Math.floor(ratingCoff * 10)
    winner.force += force
    winner.rating += winnerRating
    winner.save()

    looser.rating -= looserRating
    if (looser.rating < 0) {
      looser.rating = 0
    }
    looser.save()

    const canvas = await duelImageGenerator.generate(winner, looser)
    const uploaded = await this.petsPlugin.henta.vk.upload.messagePhoto({ source: canvas.toBuffer() })
    const msg = {
      attachment: uploaded.toString(),
      message: [
        `⚜ ${winner.name} победил!`,
        `➕ ${force} ед. силы питомцу.`,
        `➕ ${winnerRating} ед. рейтинга питомцу.`,
        `\n➖ ${looserRating} ед. рейтинга проигравшему.`
      ].join('\n')
    }

    this.peers.forEach(peerId =>
      this.petsPlugin.henta.vk.api.messages.send(Object.assign({ peer_id: peerId }, msg))
    )

    winner.getOwner().then(user => user.unlockAchievement('petWinner'))
    this.petsPlugin.duel.duelSessions.delete(this)
  }

  getData() {
    return {
      petIds: this.petIds,
      healths: this.healths,
      peers: this.peers,
      lastAttackerId: this.lastAttackerId
    }
  }
}

module.exports = DuelWorker