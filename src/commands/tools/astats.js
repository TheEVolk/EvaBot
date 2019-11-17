import moment from 'moment';
import fetch from 'node-fetch';

function getTotal(day) {
  return day.reduce((acc, v) => acc + v);
}

// eslint-disable-next-line no-unused-vars
function getRecord(stats) {
  return Object.values(stats).reduce((acc, v) => (getTotal(v) > getTotal(acc) ? v : acc), [0]);
}

class DaySubcommand {
  name = 'сводка';

  getChangeStr(today, yesterday = 0) {
    const percent = 100 - Math.floor(
      // eslint-disable-next-line no-mixed-operators
      Math.min(yesterday, today) / Math.max(yesterday, today) * 100
    );

    const change = yesterday !== today && ` (${today >= yesterday ? '➕' : '➖'}${percent}%)`;
    return `${today.toLocaleString('ru')}${change || ''}`;
  }

  getPercent(today, yesterday = 1) {
    const percent = 100 - Math.floor(
      // eslint-disable-next-line no-mixed-operators
      Math.min(yesterday, today) / Math.max(yesterday, today) * 100
    );

    return today >= yesterday ? percent : -percent;
  }

  async handler(ctx) {
    const activeStatsPlugin = ctx.getPlugin('common/activeStats');

    const dateStr = activeStatsPlugin.getDateStr();
    const yesterdayStr = activeStatsPlugin.getDateStr(-1);

    const messagesChanges = this.getChangeStr(
      getTotal(activeStatsPlugin.stats[dateStr]),
      getTotal(activeStatsPlugin.stats[yesterdayStr])
    );

    const usersChanges = this.getChangeStr(
      activeStatsPlugin.userStats[dateStr],
      activeStatsPlugin.userStats[yesterdayStr] || 0
    );

    const total = (
      this.getPercent(
        activeStatsPlugin.userStats[dateStr],
        activeStatsPlugin.userStats[yesterdayStr]
      )
      + this.getPercent(
        getTotal(activeStatsPlugin.stats[dateStr]),
        getTotal(activeStatsPlugin.stats[yesterdayStr])
      )
    ) / 2;

    console.log(this.getPercent(
      activeStatsPlugin.userStats[dateStr],
      activeStatsPlugin.userStats[yesterdayStr]
    ))

    const quality = {
      type: 'radialGauge',
      data: {
        datasets: [
          { data: [total], backgroundColor: total > 0 ? 'green' : 'red' }
        ]
      }
    };

    const posts = await ctx.vk.api.wall.get({
      owner_id: -67782575,
      count: 1000,
      access_token: ctx.henta.config.private.pageToken
    });

    const cits = posts.items
      .filter(v => v.attachments.length === 2)
      .map(v => v.text);

    const citation = cits[Math.floor(Math.random() * cits.length)];
    ctx.builder()
      .lines([
        '📊 Результаты этого дня:',
        `💌 Сообщения: ${messagesChanges}`,
        `👥 Новых игроков: ${usersChanges}`,
        `\n${citation}`
      ])
      .photo(`https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(quality))}`)
      .answer();
  }
}

export default class AStatsCommand {
  name = 'астат';
  subcommands = [
    new DaySubcommand()
  ]

  constructor() {
    moment.locale('ru');
  }

  handler(ctx) {
    const activeStatsPlugin = ctx.getPlugin('common/activeStats');

    const recordDay = Object.values(activeStatsPlugin.stats).reduce((acc, v) => {
      const accTotal = acc.reduce((acc2, v2) => acc2 + v2);
      const total = v.reduce((acc2, v2) => acc2 + v2);

      return total > accTotal ? v : acc;
    }, [0]);

    const jsonData = {
      type: 'line',
      data: {
        labels: new Array(24).fill(0).map((_, i) => i),
        datasets: [
          {
            fill: true,
            label: 'Сегодня',
            data: activeStatsPlugin.getThisDayStats()
          },
          {
            fill: false,
            label: 'Вчера',
            data: activeStatsPlugin.stats[activeStatsPlugin.getDateStr(-1)]
          },
          {
            fill: false,
            label: 'Рекорд',
            data: recordDay
          }
        ]
      }
    };

    ctx.builder()
      .photo(`https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(jsonData))}`)
      .answer();
  }
}
