export default class {
  constructor () {
    Object.assign(this, {
      name: 'рассылка',
      description: 'управление подпиской на рассылку',
      emoji: '📣',

      subcommands: {
        сменить: {
          handler: this.changeHandler,
          arguments: { slug: { type: 'string' } }
        }
      }
    })
  }

  async handler (ctx) {
    const { categories } = ctx.getPlugin('common/allmail')
    const subscribes = await ctx.user.allmain.getSubscribes()

    const keyboard = ctx.keyboard()
    categories.forEach(v =>
      keyboard.textButton({
        label: `${v.emoji} ${v.title}`,
        color: subscribes.includes(v.slug) ? 'positive' : 'negative',
        payload: { botcmd: `рассылка сменить ${v.slug}` }
      }).row()
    )

    ctx.builder()
      .lines([
        '✉ Категории рассылки:',
        ...categories.map(v =>
          `[${subscribes.includes(v.slug) ? '✔' : '❌'}] ${v.title}'.`
        )
      ])
      .keyboard(keyboard)
      .answer()
  }

  async changeHandler (ctx) {
    const { categories } = ctx.getPlugin('common/allmail')
    const { briefNumber } = ctx.getPlugin('mybot/moneys')

    const category = ctx.assert(
      categories.find(v => v.slug === ctx.params.slug),
      '📛 Такая подписка не существует.'
    )

    const isSubscribed = await ctx.user.allmain.is(category.slug)

    if (isSubscribed) {
      ctx.user.allmain.unsubscribe(category.slug)

      ctx.builder()
        .text(`💔 Вы отписались от <<${category.title}>>`)
        .textButton({ label: 'Назад', payload: { botcmd: 'рассылка' } })
        .answer()
    } else {
      ctx.user.allmain.subscribe(category.slug)

      ctx.builder()
        .lines([
          `${category.emoji} Вы подписались на <<${category.title}>>`,
          `💸 За каждое полученное сообщение вы будете получать ${briefNumber(category.bonus)} бит!`
        ])
        .textButton({ label: 'Назад', payload: { botcmd: 'рассылка' } })
        .answer()
    }
  }
}
