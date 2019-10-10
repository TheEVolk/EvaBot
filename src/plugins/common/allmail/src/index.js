import model from './model'

export default class {
  constructor (henta) {
    Object.assign(this, {
      henta
    })
  }

  async init (henta) {
    const dbPlugin = henta.getPlugin('common/db')
    const usersPlugin = henta.getPlugin('common/users')

    // Load categories
    this.categories = await henta.util.loadSettings('allmailCategories.json')

    // Add user methods
    usersPlugin.group('allmain')
      .method('is', async (self, slug) =>
        !!await this.AllmailSubscriber.findOne({ where: { vkId: self.vkId, slug } })
      )
      .method('subscribe', (self, slug) =>
        this.AllmailSubscriber.create({ where: { vkId: self.vkId, slug } })
      )
      .method('unsubscribe', (self, slug) =>
        this.AllmailSubscriber.destroy({ where: { vkId: self.vkId, slug } })
      )
      .method('getSubscribes', async (self) => {
        const rows = await this.AllmailSubscriber.findAll({ where: { vkId: self.vkId } })
        return rows.map(v => v.slug)
      })
      .end()

    // Create Subscriber table
    this.AllmailSubscriber = dbPlugin.define('allmailSubscriber', model, { timestamps: false })
    await dbPlugin.safeSync(this.AllmailSubscriber)
  }
}
