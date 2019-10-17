export default class {
  name = 'работа'
  description = 'стабильный доход'
  emoji = '💼'

  async handler (ctx) {
    const imageCachePlugin = ctx.getPlugin('common/imageCache')
    ctx.builder()
      .attach(imageCachePlugin.get('res/img/indev.png'))
      .answer()
    /*
    const job = ctx.user.getJob()
    if (!job) {
      return ctx.builder()
        .line('💼 У вас пока нет работы:')
        .line('🔘 Нажмите на кнопку, чтобы найти работу.')
        .answer()
    }

    ctx.builder()
      .line(`💼 Ваша работа: ${job.name}`)
      .line(`💲 Ваша ЗП: ${job.payday}`)
      .answer() */
  }
}

/*
export default class {
  constructor () {
    Object.assign(this, {
      name: 'работа',
      description: 'ваша работа',
      emoji: '💼',
      subcommands: {
        уволиться: { handler: this.retireHandler },
        газета: { handler: this.findHandler },
        инфо: {
          handler: this.infoHandler,
          arguments: { job: { name: 'профессия', type: 'job' } }
        },
        устроиться: {
          handler: this.chooseHandler,
          arguments: { job: { name: 'профессия', type: 'job' } }
        }
      }
    })
  }

  handler (ctx) {
    const job = ctx.assert(ctx.user.getJob(), {
      message: ['💼 У вас пока нет работы.', '📑 Самое время устроиться!'],
      keyboard: ctx.keyboard()
        .textButton({
          label: '🔍 Найти работу',
          payload: { botcmd: 'работа газета' }
        })
    })

    ctx.params = { job }
    this.infoHandler(ctx)
  }

  infoHandler (ctx) {
    const { briefNumber } = ctx.getPlugin('mybot/moneys')
    const job = ctx.params.job

    const builder = ctx.builder()
    builder.lines([
      `💼 ${job.name}:`,
      `📋 ${job.description}`,
      '',
      `💰 Зарплата: ${briefNumber(job.payDay)} бит.`,
      `🔒 Доступно с ${job.minLvl} уровня.`
    ])

    if (!ctx.user.job) {
      builder.textButton({
        label: '📝 Устроиться',
        payload: { botcmd: `работа устроиться ${job.name}` }
      })
    } else {
      builder.textButton({
        label: '🚪 Уволиться',
        payload: { botcmd: 'работа уволиться' }
      })
    }

    builder.answer()
  }

  retireHandler (ctx) {
    ctx.user.assertJob(ctx, 'has')
    ctx.user.job = null

    ctx.builder()
      .lines(['✔ Вы успешно уволились с работы!'])
      .textButton({ label: '💼 К работам', payload: { botcmd: 'работа газета' } })
  }

  findHandler (ctx) {
    const jobsPlugin = ctx.getPlugin('systems/jobs')

    const keyboard = ctx.keyboard().oneTime(false)

    jobsPlugin.list.forEach((v, i) => {
      if (i % 2 === 0) keyboard.row()
      keyboard.textButton({
        label: `${v.name}`,
        payload: { botcmd: `работа инфо ${v.name}` },
        color: 'primary'
      })
    })

    ctx.builder([
      '🌷 Выбирайте работу!',
      ...jobsPlugin.list.map((v, i, { length }) => `${i + 1}.⠀${v.name} -- ${v.payDay} бит в сутки${i === length - 1 ? '.' : ';'}`
      )]).keyboard(keyboard).answer()
  }

  chooseHandler (ctx) {
    ctx.user.assertJob(ctx, 'free')
    ctx.user.job = ctx.params.job.tag

    ctx.answer([
      `✔ Добро пожаловать на работу <<${ctx.params.job.name}>>`,
      `
Вы будете получать зарплату каждый день в 18:15 (МСК).`
    ])
  }
}
*/
