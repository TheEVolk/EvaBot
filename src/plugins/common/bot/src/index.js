import MessageProcessor from './messageProcessor'

export default class {
  constructor (henta) {
    Object.assign(this, {
      henta,
      messageProcessor: new MessageProcessor(this)
    })
  }

  async init (henta) {
    this.settings = await henta.util.loadSettings('bot/main.json')
    await this.messageProcessor.init(this)
  }
}
