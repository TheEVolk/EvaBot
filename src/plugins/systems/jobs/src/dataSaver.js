export default async function startDataSaver (plugin) {
  const redisPlugin = plugin.henta.getPlugin('common/redis')

  // Save
  process.on('SIGINT', () => {
    const obj = {}
    for (const [key, value] of plugin.lastSalaries) {
      obj[key] = value
    }
    redisPlugin.setObject('jobs:lastSalaries', obj)
  })

  // Load
  const lastSalariesSaves = await redisPlugin.getObject('jobs:lastSalaries')
  if (lastSalariesSaves) {
    plugin.lastSalaries = new Map(Object.entries(lastSalariesSaves))
    plugin.henta.log(`Зарплаты успешно восстановлены. (${plugin.lastSalaries.size} шт.)`)
  }
}
