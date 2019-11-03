import fs from 'fs'

export default class SetverCommand {
  name = 'сетвер'
  description = 'обновить бота'
  emoji = '🆙'
  right = 'setver'
  arguments = {
    ver: { name: 'версия', type: 'string' }
  }

  async handler (ctx) {
    const wall = ctx.getAttachments('wall')[0];
    if (!wall) {
      return ctx.answer('Вы не прикрепили запись к сообщению.');
    }

    if (!wall.text.includes('#обновление@bot_eva')) {
      return ctx.answer('В записи нет хештега.')
    }

    const versions = await ctx.henta.util.loadSettings('updates.json');
    versions[ctx.params.ver] = wall.toString();

    const data = await ctx.henta.util.loadSettings('../package.json');
    const oldVersion = data.version;
    data.version = ctx.params.ver;

    fs.writeFileSync(`${ctx.henta.botdir}/package.json`, JSON.stringify(data, true));
    fs.writeFileSync(`${ctx.henta.botdir}/settings/updates.json`, JSON.stringify(versions, true));

    ctx.answer([
      `🆙 Новая версия:`,
      `⬛ ${oldVersion} » ${data.version}.`
    ])
  }
}