const { createCanvas, loadImage, registerFont } = require('canvas');
const CronJob = require('cron').CronJob;

class LiveCoverPlugin {
  constructor(henta) {
      this.henta = henta;
      this.version = require(`${henta.botdir}/package.json`).version;
  }

  init(henta) {
    registerFont(`${henta.botdir}/res/font/bork-display.otf`, { family: "Bork Display" });
  }

  start(henta) {
    new CronJob('0 * * * * *', this.drawAndUpload.bind(this)).start()
  }

  async drawAndUpload () {
    const { canvas } = await this.draw()

    this.henta.vk.upload.groupCover({
      source: canvas.toBuffer(),
      group_id: this.henta.getConfigValue('vk_groupid'),
      crop_x2: 1590,
      crop_y2: 400
    })
  }

  async draw() {
    const stats = this.getStats()
    const coverBackground = await loadImage(`${this.henta.botdir}/res/img/cover.png`)

    const canvas = createCanvas(1590, 400)
    const context = canvas.getContext('2d')
    context.drawImage(coverBackground, 0, 0)

    context.shadowOffsetX = 3
    context.shadowOffsetY = 3
    context.shadowBlur = 5
    context.shadowColor = "black"
    context.textAlign = "center"
    
    this.drawCoolText(context, 'Ева Цифрова', canvas.width / 2, canvas.height / 2 - 70, 100)

    /* Stats title */    
    this.drawCoolText(context, 'Версия', canvas.width / 2 - 400, canvas.height / 2 + 110, 40)
    this.drawCoolText(context, 'Онлайн', canvas.width / 2, canvas.height / 2 + 110, 40)
    this.drawCoolText(context, 'мс/ответ', canvas.width / 2 + 400, canvas.height / 2 + 110, 40)

    /* Stats value */
    this.drawCoolText(context, stats.version, canvas.width / 2 - 400, canvas.height / 2 + 60, 60)
    this.drawCoolText(context, stats.online, canvas.width / 2, canvas.height / 2 + 60, 60)
    this.drawCoolText(context, stats.responseTime, canvas.width / 2 + 400, canvas.height / 2 + 60, 60)

    return { canvas, context }
  }

  drawCoolText(context, str, x, y, fontSize) {
    context.font = `${fontSize}px Bork Display`
    context.fillStyle = 'black'
    context.fillText(str, x + 1, y + 1)
    context.fillText(str, x + 1, y + 2)
    context.fillText(str, x + 1, y + 3)
    context.fillStyle = 'white'
    context.fillText(str, x, y)
  }

  getStats() {
    const online = this.henta.getPlugin('mybot/online').getOnline()
    const version = require(`${this.henta.botdir}/package.json`).version
    const responseTime = this.henta.getPlugin('common/hentadmin').avgResponseTime

    return { online, responseTime, version }
  }
}

module.exports = LiveCoverPlugin;
