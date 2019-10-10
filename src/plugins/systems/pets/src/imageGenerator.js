const nodeCanvas = require('canvas')

module.exports = async function ({ getPlugin }) {
  const redisPlugin = getPlugin('common/redis')

  return {
    get: async ({ type, name, variety }) => {
      return await redisPlugin.get(`images:pet:${type}:${name}:${variety}`) ||
        this.imageGenerator.generateAndUpload({ type, name, variety })
    },

    generateAndUpload: async ({ type, name, variety }) => {
      this.henta.log(`Генерация превью для ${name} [${type}, ${variety}]...`)

      const { canvas } = await this.imageGenerator.generate({ type, name, variety })
      const uploaded = await this.henta.vk.upload.messagePhoto({ source: canvas.toBuffer() })
      await redisPlugin.set(`images:pet:${type}:${name}:${variety}`, uploaded.toString())

      return uploaded.toString()
    },

    generate: async (pet) => {
      const backgroundImage = await nodeCanvas.loadImage(`./res/img/pets/background.png`)
      const petImage = await nodeCanvas.loadImage(`./res/img/pets/${pet.type}/${pet.variety}.png`)

      const canvas = nodeCanvas.createCanvas(512, 512)
      const context = canvas.getContext('2d')

      context.drawImage(backgroundImage, 0, 0)
      context.drawImage(petImage, 0, 0)

      context.textAlign = 'left'
      context.shadowOffsetX = 3
      context.shadowOffsetY = 3
      context.shadowBlur = 20
      context.shadowColor = 'black'

      context.fillStyle = 'rgba(255,255,255,255)'
      context.font = `43px Bork Display`
      context.fillText(pet.name, 12, 490)

      return { context, canvas }
    }
  }
}
