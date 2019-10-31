import Sequelize from 'sequelize'

export default class SeedsGamePlugin {
  constructor (henta) {
    this.henta = henta

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
    const row = await this.SeedsStat.findOne({ where: { vkId } });
    if (row) {
      return row.count
    }
  }

  getTotal () {
    return this.SeedsStat.sum('count');
  }

  async peck (vkId) {
    const [row] = await this.SeedsStat.findOrCreate({ where: { vkId } });
    row.count++;
    await row.save();
    
    return row.count
  }
}