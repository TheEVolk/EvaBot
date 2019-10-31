import Sequelize from 'sequelize'
import Vk from 'vk-io'
import SharGame from '../../../../postgames/shar.js'
import ProstranstvoGame from '../../../../postgames/prostranstvo.js'

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

    henta.vk.updates.on('comment', this.processUserAnswer.bind(this))
  }

  async start (henta) {
    // this.createGame(ProstranstvoGame)
    // this.debugGame(ProstranstvoGame)
  }

  async processUserAnswer (ctx, next) {
    if (ctx.userId < 0) {
      return next()
    }

    const gameProcess = await this.PostGameProcess.findOne({
      where: { wallId: ctx.objectId }
    })

    if (!gameProcess) {
      return next()
    }

    const usersPlugin = this.henta.getPlugin('common/users')
    const user = await usersPlugin.get(ctx.userId)
    if (!user) {
      this.henta.vk.api.wall.createComment({
        owner_id: -134466548,
        post_id: gameProcess.wallId,
        reply_to_comment: ctx.id,
        message: '❔ Похоже я вижу тебя впервые и не могу проверить твой ответ без регистрации. Напиши мне в ЛС, а после, вернись сюда и напиши свой ответ снова.'
      })
      return next()
    }

    const answered = JSON.parse(gameProcess.answered)
    if (answered[user.vkId]) {
      return user.send('🎈 Вы уже участвовали в этой игре.')
    }

    if (ctx.text.toLowerCase().replace('ё', 'е') === gameProcess.rightAnswer) {
      const { diffLine } = this.henta.getPlugin('systems/moneys')
      user.money += gameProcess.bonus
      user.lvl.addScore(100)
      user.save()

      user.send([
        '✔ Ты правильно ответил в игре и получил приз!',
        diffLine(user, gameProcess.bonus)
      ])

      answered[user.vkId] = 'W'
    } else {
      user.send([
        '❌ Увы, но ты ошибся с ответом.',
        '💢 В этой игре больше нельзя отвечать.'
      ])

      answered[user.vkId] = 'L'
    }

    if (Object.entries(answered).filter(v => v[1] === 'W').length >= 100) {
      this.destroyGame(gameProcess)
    } else {
      gameProcess.answered = JSON.stringify(answered)
      gameProcess.save()
    }

    await next()
  }

  destroyGame (gameProcess) {
    this.henta.vk.api.wall.createComment({
      owner_id: -134466548,
      post_id: gameProcess.wallId,
      message: '🔷 Игра завершена!'
    })
  }

  async createGame (GameClass) {
    const currentGame = new GameClass()
    const bonus = 10000 + Math.floor(Math.random() * 1e6)

    const uploader = new Vk({
      token: this.henta.config.private.pageToken
    })

    const photo = await uploader.upload.wallPhoto({
      source: await currentGame.generateImage()
    })

    const wallId = await uploader.api.wall.post({
      owner_id: -134466548,
      message: `💰 Напиши ответ в комментарии и получи ${bonus.toLocaleString()} бит!\n\n#game@bot_eva`,
      attachment: photo.toString()
    })

    this.henta.vk.api.wall.createComment({
      owner_id: -134466548,
      post_id: wallId.post_id,
      message: '* Вы должны быть зарегистрированы в боте. Для регистрации просто отправьте мне в ЛС любое сообщение.'
    })

    this.PostGameProcess.create({
      wallId: wallId.post_id,
      answered: '{}',
      rightAnswer: currentGame.rightAnswer,
      createTime: Math.floor(Date.now() / 1000),
      bonus: bonus
    })

    // Debug
    /* const usersPlugin = this.henta.getPlugin('common/users')
    const user = await usersPlugin.get(169494689)
    user.sendBuilder()
      .text(`Правильный ответ: ${currentGame.rightAnswer}`)
      .photo(await currentGame.generateImage())
      .send() */
  }

  async debugGame (GameClass) {
    const currentGame = new GameClass()
    const usersPlugin = this.henta.getPlugin('common/users')
    const user = await usersPlugin.get(169494689)
    user.sendBuilder()
      .text(`Правильный ответ: ${currentGame.rightAnswer}`)
      .photo(await currentGame.generateImage())
      .send()
  }
}
