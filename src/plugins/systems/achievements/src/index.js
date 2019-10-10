import sendNotification from './notificationSender'
import initDb from './dbAchievement'
import initUserMethods from './userMethods'

export default class {
  constructor (henta) {
    this.henta = henta
    this.sendNotification = sendNotification
  }

  async init (henta) {
    await initDb(this)
    await initUserMethods(this)
    await this.loadAchievements()
  }

  async loadAchievements () {
    this.list = await this.henta.util.loadSettings('achievements.json')
    this.fromSlug = {}

    this.list.forEach(v => { this.fromSlug[v.slug] = v })
  }

  get (slug) {
    return this.fromSlug[slug]
  }
}
