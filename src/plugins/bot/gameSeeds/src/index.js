import Sequelize from 'sequelize'

export default class SeedsGamePlugin {
  constructor (henta) {
    this.henta = henta;    
    this.cache = new Map();

    this.getStat = this.getStat.bind(this);
    this.getTotal = this.getTotal.bind(this);
    this.peck = this.peck.bind(this);
  }

  async init (henta) {
    this.initModel()
  }

  async initModel () {
    const dbPlugin = this.henta.getPlugin('common/db')
    this.SeedsStat = dbPlugin.define('seedsStat', {
      vkId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
    }, { timestamps: false })

    await dbPlugin.safeSync(this.SeedsStat)
  }

  async getStat (vkId) {
    const cachedUser = this.cache.get(vkId);
    if (cachedUser) {
      return cachedUser.count;
    }
    
    const row = await this.SeedsStat.findOne({ where: { vkId } });
    if (row) {
      this.cache.set(vkId, row);
      return row.count;
    }
  }

  getTotal () {
    return this.SeedsStat.sum('count');
  }

  async peck (vkId) {
    const cachedUser = this.cache.get(vkId);
    const [row] = cachedUser ? [cachedUser] : await this.SeedsStat.findOrCreate({ where: { vkId } });

    if (!cachedUser) {
      this.cache.set(vkId, row);
    }
    
    row.count++;
    await row.save();
    
    return row.count;
  }
}