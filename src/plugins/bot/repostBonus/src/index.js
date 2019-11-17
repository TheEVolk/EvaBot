import Sequelize from 'sequelize';
import Vk from 'vk-io';

export default class PostGamePlugin {
  constructor(henta) {
    this.henta = henta;
  }

  async init(henta) {
    const dbPlugin = henta.getPlugin('common/db');

    this.RepostProcess = dbPlugin.define('repostProcess', {
      wallId: Sequelize.INTEGER(),
      endTime: Sequelize.INTEGER()
    }, { timestamps: false });

    await this.RepostProcess.sync();
  }

  async createPost() {
    const uploader = new Vk({
      token: this.henta.config.private.pageToken
    });

    const photo = await uploader.upload.wallPhoto({
      source: 'res/img/repost.png'
    });

    // eslint-disable-next-line camelcase
    const { post_id } = await uploader.api.wall.post({
      owner_id: -134466548,
      message: '💰 Сделай репост записи и получи 1.000.000 бит!\n\n#раздача@bot_eva',
      attachment: photo
    });

    this.henta.vk.api.wall.createComment({
      owner_id: -134466548,
      message: '* Бонус будет выдан через сутки после начала акции. Вы должны быть зарегистрированы в боте. Для регистрации просто отправьте мне в ЛС любое сообщение.',
      post_id
    });

    this.RepostProcess.create({
      wallId: post_id,
      endTime: Date.now() + 86400e3
    });

    // eslint-disable-next-line camelcase
    return post_id;
  }
}
