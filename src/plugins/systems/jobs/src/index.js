import Sequelize from 'sequelize'
import startDataSaver from './dataSaver'

export default class JobsPlugin {
  constructor (henta) {
    this.henta = henta
    this.lastSalaries = new Map()
  }

  async init (henta) {
    this.initUser()
    await this.loadJobs()

    const { messageProcessor } = henta.getPlugin('common/bot')
    messageProcessor.on('answer', this.salaryCheck.bind(this))
  }

  initUser () {
    const usersPlugin = this.henta.getPlugin('common/users')

    usersPlugin.field('job', Sequelize.STRING(16))
    usersPlugin.group('jobs')
      .method('get', (user) => user.job && this.get(user.job))
      .method('paySalary', (user) => this.paySalary(user))
      .end()
  }

  async loadJobs () {
    this.list = await this.henta.util.loadSettings('jobs.json')
    this.fromSlug = {}

    this.list.forEach(v => { this.fromSlug[v.slug] = v })
  }

  start () {
    startDataSaver(this)
  }

  salaryCheck (ctx, builder) {
    if (ctx.user.job === null) {
      return
    }

    if (this.lastSalaries.get(ctx.user.vkId) &&
      Date.now() / 1000 - this.lastSalaries.get(ctx.user.vkId) < 86400) {
      return
    }

    this.lastSalaries.set(ctx.user.vkId, Date.now() / 1000)
    setTimeout(() => {
      if (!ctx.user.job) {
        return // Wtf!? Успел уволиться, гад.
      }

      const { diffLine } = ctx.getPlugin('systems/moneys')
      const { salary } = ctx.user.jobs.get()

      ctx.user.money += salary
      ctx.send([
        `💳 Вы получили зарплату!`,
        diffLine(ctx.user, salary)
      ])
    }, 1000)
  }

  get (slug) {
    return this.fromSlug[slug]
  }
}
