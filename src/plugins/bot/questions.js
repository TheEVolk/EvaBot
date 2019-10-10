class QuestionsPlugin {
  constructor(henta) {

  }

  init(henta) {
      henta.getPlugin('common/bot').addHandler((async (ctx, next) => {
        henta.
        await next();
    }).bind(this), 9990)
  }
}

module.exports = QuestionsPlugin;
