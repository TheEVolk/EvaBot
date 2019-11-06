import Sequelize from 'sequelize';

export default class BankPlugin {
  constructor(henta) {
    this.henta = henta;
    this.cache = new Map();
  }

  async init() {
    this.initModel();
  }

  async initModel() {
    const dbPlugin = this.henta.getPlugin('common/db');
    this.BankAccount = dbPlugin.define('bankAccount', {
      vkId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    }, { timestamps: false });

    await dbPlugin.safeSync(this.BankAccount);
  }

  async getRate() {
    const redisPlugin = this.henta.getPlugin('common/redis');
    return +(await redisPlugin.get('bank-rate'));
  }

  async changeRate() {
    let isUp = Math.random() > 0.5;
    let rate = await this.getRate();

    if (rate <= 500) {
      isUp = true;
    }

    if (rate >= 1000) {
      isUp = false;
    }

    rate += isUp ? 1 : -1;
    this.henta.vk.api.messages.send({
      message: `${isUp ? '📈' : '📉'} Курс: ${rate.toLocaleString('ru')} бит.`,
      chat_id: 2,
    });

    const redisPlugin = this.henta.getPlugin('common/redis');
    redisPlugin.set('bank-rate', rate);
  }

  async getAccount(vkId) {
    const cachedUser = this.cache.get(vkId);
    if (cachedUser) {
      return cachedUser;
    }

    const row = await this.BankAccount.findOne({ where: { vkId } });
    if (row) {
      this.cache.set(vkId, row);
      return row;
    }
  }

  async createAccount(vkId) {
    const [row] = await this.BankAccount.findOrCreate({ where: { vkId } });
    this.cache.set(vkId, row);

    return row;
  }
}
