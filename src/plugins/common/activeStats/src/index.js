export default class ActiveStatsPlugin {
  constructor(henta) {
    this.henta = henta;
  }

  init(henta) {
    const { messageProcessor } = henta.getPlugin('common/bot');
    messageProcessor.on('answer', this.onAnswerMessage.bind(this));
  }

  async start(henta) {
    const redisPlugin = henta.getPlugin('common/redis');
    this.stats = await redisPlugin.serializer.run({
      slug: 'active-stats',
      defaultValue: {}
    });
  }

  getDateStr() {
    const date = new Date();
    return `${date.getUTCFullYear()}:${date.getUTCMonth() + 1}:${date.getUTCDate()}`;
  }

  getThisDayStats() {
    const dateStr = this.getDateStr();
    this.stats[dateStr] = this.stats[dateStr] || {};

    return this.stats[dateStr];
  }

  getThisStats() {
    const dayStats = this.getThisDayStats();
    const thisHour = new Date().getHours();

    dayStats[thisHour] = dayStats[thisHour] || 0;
    return dayStats[thisHour];
  }

  onAnswerMessage() {
    const dayStats = this.getThisDayStats();
    const thisHour = new Date().getHours();

    dayStats[thisHour] = (dayStats[thisHour] || 1) + 1;
  }
}
