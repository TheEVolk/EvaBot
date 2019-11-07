export default class RedisSerializer {
  constructor(plugin) {
    this.plugin = plugin;
    this.saveList = new Set();

    plugin.henta.onShutdown(() => this.saveAll());
  }

  async saveAll() {
    this.plugin.henta.log(`Сохранение информации redis (${this.saveList.size} шт.)`);
    await Promise.all(Array.from(this.saveList).map(v => this.save(v)));
  }

  async save(data) {
    const stringData = JSON.stringify(data.class ? [...data.value] : data.value);
    await this.plugin.set(`serializer:${data.slug}`, stringData);
  }

  async run(data) {
    const fromRedis = await this.plugin.get(`serializer:${data.slug}`);
    const loaded = fromRedis ? JSON.parse(fromRedis) : data.defaultValue;

    const Class = data.class;
    const value = Class ? new Class(loaded) : loaded;

    this.saveList.add({ ...data, value });
    return value;
  }
}
