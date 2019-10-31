import Sequelize from 'sequelize'
import asyncRedis from 'async-redis'
import SequelizeRedis from 'sequelize-redis'
import lodash from 'lodash'

export default class extends Sequelize {
  constructor (henta) {
    const dbConfig = henta.config.private.database
    super(dbConfig.name, dbConfig.user, dbConfig.pass, dbConfig.options)
    this.henta = henta
  }

  async init (henta) {
    try {
      await super.authenticate()
      this.redisClient = asyncRedis.createClient()
      this.sequelizeRedis = new SequelizeRedis(this.redisClient)
      henta.log('База данных успешно подключена.')
    } catch (err) {
      throw Error(`Ошибка авторизации в базе данных (${err.message})`)
    }
  }

  defineCached (name, model, settings, cacheSettings) {
    return this.sequelizeRedis.getModel(
      super.define(name, model, settings),
      cacheSettings || { ttl: 60 * 60 * 24 }
    )
  }

  async safeSync (model) {
    // return
    
    await model.sync()
    const options = model.options
    const queryInterface = model.QueryInterface
    const tableName = model.getTableName(options)

    const columns = await queryInterface.describeTable(tableName)

    for (const columnName of Object.keys(model.tableAttributes)) {
      if (columns[columnName]) continue

      const answer = await this.henta.cmdline.questionYN(`Добавить "${columnName}" в таблицу "${tableName}"`)
      if (answer) {
        this.henta.log(`Добавляю "${columnName}" в таблицу "${tableName}"...`)
        await queryInterface.addColumn(tableName, columnName, model.tableAttributes[columnName])
      } else {
        this.henta.logger.log(`Пропускаю...`)
      }
    }

    for (const columnName of Object.keys(columns)) {
      if (model.tableAttributes[columnName]) continue

      const answer = await this.henta.cmdline.questionYN(`Удалить "${columnName}" из таблицы "${tableName}"`)
      if (answer) {
        this.henta.log(`Удаляю "${columnName}" из таблицы "${tableName}"...`)
        await queryInterface.removeColumn(tableName, columnName, options)
      } else {
        this.henta.logger.log(`Пропускаю...`)
      }
    }

    this.henta.logger.log(`Синхронизация таблицы "${tableName}" успешно завершена.`)
  }
}
