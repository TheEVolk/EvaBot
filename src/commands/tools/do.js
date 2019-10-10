export default class {
  constructor (henta) {
    Object.assign(this, {
      henta: henta,
      name: '$',
      arguments: {
        code: { name: 'код', type: 'string' }
      },
      type: 'tools',
      description: 'выполнить код',
      right: 'do'
    })
  }

  async handler (ctx) {
    const attachment = (str) => { ctx.send({ attachment: str }) }

    try {
      if (!ctx.params.code.includes('\n') && !ctx.params.code.includes('=')) {
        ctx.params.code = `return ${ctx.params.code}`

        const func = eval('(async () => {' + ctx.params.code + '})')

        const startTime = Date.now()
        const result = await func()
        const diffTime = Date.now() - startTime
        ctx.answer([
          `⏱ Код выполнен за ${diffTime} мс.`,
          `${String(result)}`
        ])
      }
    } catch (e) {
      if (!e.stack) throw e
      ctx.answer(e.stack)
    }
  }
}
