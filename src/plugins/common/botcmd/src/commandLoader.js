import ProgressBar from 'progress'
import fs from 'fs'

export default async function loadCommands (henta) {
  const commandList = await readDir(`${henta.botdir}/src/commands`)

  const bar = new ProgressBar('Загрузка команд [:bar] :current/:total (:command)', {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: commandList.size
  })

  henta.logger.setBar(bar)

  const commands = new Set()

  for (const command of commandList) {
    bar.tick({ command })
    commands.add(await loadCommand(command))
  }

  bar.terminate()
  henta.log(`Команды успешно загружены (${commandList.size} шт.)`)
  return Array.from(commands)
}

async function readDir (dirPath) {
  const files = new Set()
  const dir = fs.readdirSync(dirPath)
  await Promise.all(dir.map(async v => {
    const filePath = `${dirPath}/${v}`
    if (fs.lstatSync(filePath).isDirectory()) {
      const nextDir = await readDir(filePath)
      nextDir.forEach(v => files.add(v))
    } else {
      files.add(filePath)
    }
  }))

  return files
}

async function loadCommand (path) {
  try {
    const commandModule = await import(path)
    const CommandClass = commandModule['default'] || commandModule
    const command = new CommandClass()

    command.type = path.split('/')[path.split('/').length - 2].split('.')[0]
    return command
  } catch (e) {
    throw Error(`Ошибка в команде ${path}: ${e.stack}`)
  }
}
