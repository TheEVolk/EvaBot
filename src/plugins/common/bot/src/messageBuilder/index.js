import makeMsg from './dataToMsg'

export default class MessageBuilder {
  constructor (data, defaultValues) {
    this.msg = defaultValues || {}
    if (data) {
      Object.assign(this.msg, makeMsg(data))
    }

    this.msg['disable_mentions'] = this.msg['disable_mentions'] || 1
  }

  setContext (context) {
    this.context = context
  }

  async send () {
    this.msg['peer_id'] = this.context.peerId
    await this.run()
    return this.context.vk.api.messages.send(this.msg)
  }

  async uploadAttachments () {
    if (!this.msg.attachment) {
      return
    }

    if (typeof this.msg.attachment !== 'object' || !Array.isArray(this.msg.attachment)) {
      this.msg.attachment = [this.msg.attachment]
    }

    this.msg.attachment = await Promise.all(this.msg.attachment)
  }

  async run () {
    await Promise.all([this.uploadAttachments()])
  }

  line (text) {
    if (!text) {
      return
    }

    return this.manageText((str) => str ? `${str}\n${text}` : text)
  }

  lines (lines) {
    lines.forEach(item => this.line(item))
    return this
  }

  text (text) {
    return this.manageText((str) => str ? `${str}${text}` : text)
  }

  manageText (func) {
    this.msg.message = func(this.msg.message)
    return this
  }

  keyboard (keyboard) {
    this.msg.keyboard = keyboard
    return this
  }

  attach (attachment) {
    if (!this.msg.attachment) {
      this.msg.attachment = []
    }

    if (typeof this.msg.attachment !== 'object') {
      this.msg.attachment = [this.msg.attachment]
    }

    this.msg.attachment.push(attachment)
    return this
  }

  audioMessage (source) {
    return this.attach(
      this.context.vk.upload.audioMessage({
        ['peer_id']: this.context.peerId,
        source
      })
    )
  }

  photo (source) {
    return this.attach(
      this.context.vk.upload.messagePhoto({
        ['peer_id']: this.context.peerId,
        source
      })
    )
  }

  getKeyboard () {
    return this.msg.keyboard
  }
}