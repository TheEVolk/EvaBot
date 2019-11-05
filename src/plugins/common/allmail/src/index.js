import model from './model'

export default class AllmailPlugin {
  constructor (henta) {
    Object.assign(this, {
      henta
    })
  }

  async init (henta) {
    const dbPlugin = henta.getPlugin('common/db')
    const usersPlugin = henta.getPlugin('common/users')

    // Load categories
    this.categories = await henta.util.loadSettings('allmailCategories.json');

    // Add user methods
    usersPlugin.group('allmain')
      .method('is', async (self, slug) =>
        !!await this.AllmailSubscriber.findOne({ where: { vkId: self.vkId, slug } })
      )
      .method('subscribe', ({ vkId }, slug) =>
        this.AllmailSubscriber.create({ vkId, slug })
      )
      .method('unsubscribe', ({ vkId }, slug) =>
        this.AllmailSubscriber.destroy({ vkId, slug })
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