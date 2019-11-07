import asyncRedis from 'async-redis';
import RedisSerializer from './serializer';

export default class {
  constructor(henta) {
    this.henta = henta;
    this.serializer = new RedisSerializer(this);
  }

  async init(henta) {
    this.settings = await henta.util.loadSettings('redis.json');
    this.client = asyncRedis.createClient();
  }

  get(key) {
    return this.client.get(`${this.settings.tag}::${key}`);
  }

  set(key, value) {
    return this.client.set(`${this.settings.tag}::${key}`, value);
  }

  del(key) {
    return this.client.del(`${this.settings.tag}::${key}`);
  }

  async getObject(key) {
    const raw = await this.get(key);
    return raw && JSON.parse(raw);
  }

  setObject(key, value) {
    return this.set(key, JSON.stringify(value));
  }
}
