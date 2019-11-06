import Sequelize from 'sequelize';
import startDataSaver from './dataSaver';

export default class JobsPlugin {
  constructor(henta) {
    this.henta = henta;
    this.lastSalaries = new Map();
  }

  async init() {
    this.initUser();
    await this.loadJobs();
  }

  initUser() {
    const usersPlugin = this.henta.getPlugin('common/users');

    usersPlugin.field('job', Sequelize.STRING(16));
    usersPlugin.group('jobs')
      .method('get', user => user.job && this.get(user.job))
      .method('paySalary', user => this.paySalary(user))
      .end();
  }

  async loadJobs() {
    this.list = await this.henta.util.loadSettings('jobs.json');
    this.fromSlug = {};

    this.list.forEach(v => { this.fromSlug[v.slug] = v; });
  }

  start() {
    startDataSaver(this);
  }

  get(slug) {
    return this.fromSlug[slug];
  }
}
