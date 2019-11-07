import Sequelize from 'sequelize'

export default class {
  constructor (henta) {
    this.henta = henta
  }

  init () {
    this.initUsers()
  }

  initUsers () {
    const usersPlugin = this.henta.getPlugin('common/users')

    usersPlugin.field('level', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    })

    usersPlugin.field('score', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    })

    usersPlugin.group('lvl')
      .method('getMaxScore', (self) => this.getMaxScore(self.level))
      .method('getProgress', (self) => Math.floor(self.score / self.lvl.getMaxScore() * 100))
      .method('addScore', (self, count) => {
        self.score += count
        if (self.score >= self.lvl.getMaxScore()) {
          this.addLevel(self)
        }
      })
      .end()
  }

  addLevel (user) {
    user.score -= user.lvl.getMaxScore();
    user.level += 1

    user.send(`💡 Вы получили ${user.level} уровень!`)
    this.henta.log(`${user.getFullName()} получил ${user.level} уровень.`)
  }

  getMaxScore (level) {
    if (level <= 1) {
      return 100
    }

    return Math.floor(this.getMaxScore(level - 1) * 1.5)
  }
}