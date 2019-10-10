const Sequelize = require('sequelize');

class LvlPlugin {
  constructor(henta) {
      const usersPlugin = henta.getPlugin('common/users');

      usersPlugin.addModelField('level', { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 });
      usersPlugin.addModelField('score', { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 });

      usersPlugin.addMethod('getMaxScore', self => this.getMaxScore(self.level));
      usersPlugin.addMethod('getScoreProgress', self => Math.floor(self.score / self.getMaxScore() * 100));
      usersPlugin.addMethod('addScore', (self, count) => {
          self.score += count;
          if (self.score >= self.getMaxScore()) {
              self.level += 1;
              self.score = 0;
              self.send(`💡 Вы получили ${self.level} уровень!`);
              henta.log(`${this.getFullName()} получил ${self.level} уровень.`);
          }
      });;
  }

  getMaxScore(level) {
      if (level <= 1) return 100;
      return Math.floor(this.getMaxScore(level - 1) * 1.5);
  }
}

module.exports = LvlPlugin;
