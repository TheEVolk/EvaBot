const asyncRedis = require('async-redis')

class RedisPlugin {
  constructor (henta) {
    this.henta = henta
  }

  async init (henta) {
    this.redisTag = await henta.util.loadSettings('redis.json')
    this.client = asyncRedis.createClient()
  }

  get (key) {
    return this.client.get(`${this.redisTag}::${key}`)
  }

  set (key, value) {
    return this.client.set(`${this.redisTag}::${key}`, value)
  }

  del (key) {
    return this.client.del(`${this.redisTag}::${key}`)
  }

  async getObject (key) {
    const raw = await this.client.get(`${this.redisTag}::${key}`)
    return raw && JSON.parse(raw)
  }

  setObject (key, value) {
    return this.client.set(`${this.redisTag}::${key}`, JSON.stringify(value))
  }
}

module.exports = RedisPlugin
