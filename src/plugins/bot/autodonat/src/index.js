import express from 'express';
import bodyParser from 'body-parser';
import Sequelize from 'sequelize';

export default class AutodonatPlugin {
  constructor(henta) {
    this.henta = henta;
  }

  async init(henta) {
    const { messageProcessor } = henta.getPlugin('common/bot');
    messageProcessor.handlers.set('autodonat', this.handler.bind(this));

    // Db
    const dbPlugin = henta.getPlugin('common/db');

    this.Donat = dbPlugin.define('donat', {
      price: Sequelize.INTEGER,
      uuid: Sequelize.STRING,
      source: Sequelize.STRING,
      vkId: Sequelize.INTEGER
    });

    await dbPlugin.safeSync(this.Donat);
    this.Donat.destroy({ where: { source: 'test' } });
  }

  start(henta) {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/', (req, res) => {
      const data = req.body;

      if (data.payment.comment.startsWith('ed_')) {
        henta.log(`Обработка ${data.payment.comment}`);
        this.processLine(data.payment.comment, data.payment.sum.amount, data.payment.txnId, 'qiwi');
      }

      res.send('OK');
    });

    app.listen(3453);
  }

  async processLine(line, count, uuid, source) {
    if (await this.Donat.findOne({ where: { uuid } })) {
      this.henta.log(`Совпадение: ${uuid}`);
      return;
    }

    const info = line.split('_');
    // eslint-disable-next-line radix
    const user = await this.henta.getPlugin('common/users').get(parseInt(info[1]));

    if (!await this.processMarket(count, info, user, uuid, source)) {
      user.send('💸 Произошла неизвестная ошибка. Администрация свяжется с вами в ближайшее время.');
      const admin = await this.henta.getPlugin('common/users').get(169494689);
      admin.send({
        message: `💸 ${user} вызвал ошибку. (${info[2]} ${count} руб.)`,
        attachment: `market-${this.henta.groupId}_${info[2]}`
      });
    }
  }

  async processMarket(count, info, user, uuid, source) {
    this.Donat.create({
      price: count,
      uuid,
      source,
      vkId: user.vkId
    });

    const markets = await this.henta.util.loadSettings('donat.json');

    const market = markets[info[2]];
    if (!market) {
      console.log('unknown');
      return false;
    }

    if (count < market.price) {
      console.log('price');
      return false;
    }

    await this.giveMarket(user, market);
    user.save();

    const admin = await this.henta.getPlugin('common/users').get(169494689);
    admin.send({
      message: `💶 ${user} приобрёл товар за ${count.toLocaleString()} руб.`,
      attachment: `market-${this.henta.groupId}_${info[2]}`
    });

    return true;
  }

  async giveMarket(user, market) {
    if (market.type === 'moneys') {
      user.money += market.count;
      user.send(`💳 Автодонат >> Вам зачислено ${market.count.toLocaleString()} бит!`);
      if (Math.random() >= 0.9) {
        user.money += 50 * 1e6;
        user.send('🛎 Вам повезло! Бонус 50 000 000 бит!');
      }
    }

    if (market.type === 'case') {
      const casesPlugin = this.henta.getPlugin('bot/cases');
      const redisPlugin = this.henta.getPlugin('common/redis');

      casesPlugin.Case.create({
        vkId: user.vkId,
        slug: market.slug
      });

      user.send(`📦 Автодонат >> ${casesPlugin.fromSlug[market.slug].title}!`);

      const bonus = await redisPlugin.get(`autodonat:${  user.vkId}`);
      if (bonus === market.slug) {
        user.send('❤ Супер! Держи еще один такой кейс!');
        casesPlugin.Case.create({
          vkId: user.vkId,
          slug: market.slug
        });
      }

      user.send('🆓 Купи сейчас такой же кейс и получи еще один абсолютно бесплатно!');
      redisPlugin.set(`autodonat:${  user.vkId}`, market.slug);
    }
  }

  async handler(ctx, next) {
    const market = ctx.getAttachments('market')[0];
    if (market) {
      const amountInteger = Math.floor(market.payload.price.amount / 100);
      const comment = `ed_${ctx.user.vkId}_${market.id}`;
      const url = `https://qiwi.com/payment/form/99?amountInteger=${amountInteger}&amountFraction=0&extra['account']=${'79247749436'}&extra['comment']=${comment}&blocked[1]=account&blocked[2]=comment&blocked[3]=sum`;
      const shortUrl = await ctx.api.utils.getShortLink({ url });

      ctx.answer([
        `🛍 Вы собираетесь купить ${market.payload.title}:`,
        'Оплатить можно по ссылке ниже:',
        shortUrl.short_url,
        '\nЕсли вы не можете оплатить по ссылке, то обратитесь в ЛС @theevolk.',
        'Не забудьте сообщить код:',
        comment
      ]);
    }

    await next();
  }
}
