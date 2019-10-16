export default class {
  constructor (henta) {
    this.henta = henta
  }

  async get (code, generator) {
    const redisPlugin = this.henta.getPlugin('common/redis')
    const cached = await redisPlugin.get(`imageCache:${code}`)
    if (cached) {
      return cached
    }

    this.henta.log(`Генерация ${code}...`)

    const source = typeof generator === 'function'
      ? await generator()
      : generator

    const uploaded = await this.henta.vk.upload.messagePhoto({ source })
    await redisPlugin.set(`imageCache:${code}`, uploaded.toString())
    this.henta.log(`${code} → ${uploaded.toString()}`)

    return uploaded.toString()
  }
}
