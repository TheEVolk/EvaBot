class HentadminPlugin {
  constructor (henta) {
    this.henta = henta
    this.messages = new Set()
    this.avgResponseTime = 0
    this.messagesInProcess = new WeakMap()
  }

  init (henta) {
    /* henta.hookManager.add('bot_process', (msg) =>
      this.onProcessMessage(msg)
    )
    henta.hookManager.add('bot_answer', (ctx) =>
      this.onAnswerMessage(ctx)
    ) */
    process.on('SIGINT', this.onProcessExit.bind(this))
  }

  async start ({ getPlugin }) {
    const redisPlugin = getPlugin('common/redis')
    this.messages = new Set(await redisPlugin.getObject('hentadmin:msgTimes'))

    this.computeResponseTime()
  }

  computeResponseTime () {
    if (this.messages.size === 0) {
      return 0
    }

    const values = Array.from(this.messages).sort((a, b) => a < b)
    const half = Math.floor(values.length / 2)

    if (values.length % 2) {
      this.avgResponseTime = values[half]
    }

    this.avgResponseTime = (values[half - 1] + values[half]) / 2.0
  }

  onProcessExit () {
    this.henta.getPlugin('common/redis')
      .setObject('hentadmin:msgTimes', Array.from(this.messages))
  }

  onProcessMessage (msg) {
    this.messagesInProcess.set(msg, Date.now())
  }

  onAnswerMessage ({ msg }) {
    const startTime = this.messagesInProcess.get(msg)
    if (!startTime) {
      return
    }

    const timeDiff = Date.now() - startTime

    setImmediate(() => {
      this.messages.add(timeDiff)
      if (this.messages.size > 1000) {
        this.messages.delete(0)
      }

      this.computeResponseTime()
      if (timeDiff > 3000) {
        this.henta.warning(`Время обработки сообщения слишком высоко: ${timeDiff} мс.`)
      }
    })
  }
}

module.exports = HentadminPlugin
