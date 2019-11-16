import Sequelize from 'sequelize';
import PlayTask from './tasks/play';
import DuelTask from './tasks/duel';

export default class PetsPlugin {
  constructor(henta) {
    this.henta = henta;

    this.taskTypes = {
      play: PlayTask,
      duel: DuelTask
    };
  }

  async init(henta) {
    this.kinds = await henta.util.loadSettings('pets/kinds.json');
    this.kindsFromSlug = Object.fromEntries(this.kinds.map(v => [v.slug, v]));
    this.getKind = slug => this.kindsFromSlug[slug];

    this.initUser(henta);
    this.initPetModel(henta);
  }

  initUser(henta) {
    const usersPlugin = henta.getPlugin('common/users');
    usersPlugin.group('pets')
      .method('get', ({ vkId: ownerVkId }) => this.Pet.findOne({ where: { ownerVkId } }))
      .end();
  }

  async initPetModel(henta) {
    const dbPlugin = henta.getPlugin('common/db');
    this.Pet = dbPlugin.define('pet', {
      name: Sequelize.STRING,
      type: Sequelize.STRING,
      ownerVkId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      variety: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      force: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      rating: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
    }, { timestamps: false });
    await dbPlugin.safeSync(this.Pet);
  }

  async start(henta) {
    const redisPlugin = henta.getPlugin('common/redis');
    this.tasks = await redisPlugin.serializer.run({
      slug: 'pets:tasks',
      class: Map
    });

    Array.from(this.tasks).forEach(([key, value]) => {
      const Task = this.taskTypes[value.type];
      // eslint-disable-next-line no-param-reassign
      value.data = new Task(this, key, value.data);
    });
  }

  createTask(petId, type, data) {
    const Task = this.taskTypes[type];
    this.tasks.set(petId, {
      data: new Task(this, petId, data),
      type
    });
  }

  getBusy(petId) {
    return this.tasks.get(petId);
  }
}
