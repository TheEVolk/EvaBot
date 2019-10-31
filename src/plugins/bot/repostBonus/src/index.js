import Sequelize from 'sequelize'
import Vk from 'vk-io'

export default class PostGamePlugin {
  constructor (henta) {
    this.henta = henta
  }

  async init (henta) {
    const dbPlugin = henta.getPlugin('common/db')

    this.PostGameProcess = dbPlugin.define('postGameProcess', {
      wallId: Sequelize.INTEGER(),
      answered: Sequelize.TEXT(),
      rightAnswer: Sequelize.STRING(),
      createTime: Sequelize.INTEGER(),
      bonus: Sequelize.INTEGER()
    }, { timestamps: false })

    await this.PostGameProcess.sync()

    henta.vk.updates.on('wall_repost', this.processUserRepost.bind(this))
  }

  async start (henta) {
    // this.createPost()
    // this.debugGame(ProstranstvoGame)
  }

  async processUserRepost (ctx, next) {
    if (ctx.userId < 0) {
      return next()
    }

    console.log(ctx)
    await next()
  }

  async createPost () {
    const uploader = new Vk({
      token: this.henta.config.private.pageToken
    })

    uploader.api.wall.post({
      owner_id: -134466548,
      message: `💰 Сделай репост записи и получи 1.000.000 бит!\n\n#раздача@bot_eva`,
      attachment: 'photo169494689_457256189'
    })
  }
}
