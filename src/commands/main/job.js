import { Keyboard } from 'vk-io'

class FindSubcommand {
  name = 'искать'

  handler (ctx) {
    if (ctx.user.job) {
      return ctx.builder()
        .line('🧧 У вас уже есть работа.')
        .keyboard(Keyboard.builder()
          .textButton({ label: `Назад`, color: 'primary', payload: { command: 'работа' } })
          .textButton({ label: `Уволиться`, color: 'negative', payload: { command: 'работа уволиться' } })
        )
        .answer()
    }

    const jobsPlugin = ctx.getPlugin('systems/jobs')
    const redisPlugin = ctx.getPlugin('common/redis')
    const job = jobsPlugin.list[Math.floor(Math.random() * jobsPlugin.list.length)]

    redisPlugin.set(`jobs:select:${ctx.user.vkId}`, job.slug)

    ctx.builder()
      .lines([
        `💼 Работа: ${job.name}`,
        `💲 Зарплата: ${job.salary.toLocaleString()} бит.`,
        `💵 Цена: ${job.price.toLocaleString()} бит.`
      ])
      .keyboard(Keyboard.builder()
        .textButton({ label: `Устроиться`, color: 'primary', payload: { command: 'работа устроиться' } })
        .textButton({ label: `Следующая`, payload: { command: 'работа искать' } })
        .row()
        .textButton({ label: `Назад`, payload: { command: 'работа' } })
        .oneTime()
      )
      .answer()
  }
}

class GetJobSubcommand {
  name = 'устроиться'

  async handler (ctx) {
    if (ctx.user.job) {
      return ctx.builder()
        .line('🧧 У вас уже есть работа.')
        .keyboard(Keyboard.builder()
          .textButton({ label: `Назад`, color: 'primary', payload: { command: 'работа' } })
          .textButton({ label: `Уволиться`, color: 'negative', payload: { command: 'работа уволиться' } })
        )
        .answer()
    }

    const jobsPlugin = ctx.getPlugin('systems/jobs')
    const redisPlugin = ctx.getPlugin('common/redis')
    const job = jobsPlugin.fromSlug[await redisPlugin.get(`jobs:select:${ctx.user.vkId}`)]
    if (!job) {
      return ctx.builder()
        .text(`🔎 Давайте для начала найдём работу.`)
        .keyboard(Keyboard.builder()
          .textButton({ label: `Искать`, color: 'primary', payload: { command: 'работа искать' } })
          .textButton({ label: `Назад`, payload: { command: 'работа' } })
          .oneTime()
        )
        .answer()
    }

    ctx.user.job = job.slug

    ctx.builder()
      .lines([
        `✔ Вы устроились на работу!`// ,
        // `💲 Зарплату можно будет получить через час, написав мне любое сообщение.`
      ])
      .keyboard(Keyboard.builder()
        .textButton({ label: `Назад`, payload: { command: 'работа' } })
        .oneTime()
      )
      .answer()
  }
}

class ResignSubcommand {
  name = 'уволиться'

  async handler (ctx) {
    if (!ctx.user.job) {
      return ctx.builder()
        .line('🧧 У вас нет работы.')
        .keyboard(Keyboard.builder()
          .textButton({ label: `Искать`, color: 'primary', payload: { command: 'работа искать' } })
          .textButton({ label: `Назад`, payload: { command: 'работа' } })
        )
        .answer()
    }

    ctx.user.job = null

    ctx.builder()
      .text(`✔ Вы уволились с работы!`)
      .keyboard(Keyboard.builder()
        .textButton({ label: `Искать`, color: 'primary', payload: { command: 'работа искать' } })
        .textButton({ label: `Меню`, payload: { command: 'меню' } })
        .oneTime()
      )
      .answer()
  }
}

export default class JobCommand {
  name = 'работа'
  description = 'стабильный доход'
  emoji = '💼'
  subcommands = [
    new FindSubcommand(this),
    new GetJobSubcommand(this),
    new ResignSubcommand(this)
  ]

  async handler (ctx) {
    const job = ctx.user.jobs.get()
    if (!job) {
      return ctx.builder()
        .line('💼 У вас пока нет работы..')
        .keyboard(Keyboard.builder()
          .textButton({ label: `Найти работу`, color: 'primary', payload: { command: 'работа искать' } })
        )
        .answer()
    }

    ctx.builder()
      .line(`💼 Работа: ${job.name}`)
      .line(`💲 Зарплата: ${job.salary.toLocaleString()} бит.`)
      .keyboard(Keyboard.builder()
        .textButton({ label: `Уволиться`, color: 'negative', payload: { command: 'работа уволиться' } })
        .textButton({ label: `Меню`, payload: { command: 'меню' } })
        .oneTime()
      )
      .answer()
  }
}
