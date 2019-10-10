export default class {
  constructor () {
    Object.assign(this, {
      name: 'обновление',
      description: 'лог изменений',
      emoji: '📑',
      arguments: {
        version: { name: 'версия', type: 'string', optional: true }
      }
    })
  }

  async handler (ctx) {
    const version = ctx.params.version || require(`${ctx.henta.botdir}/package.json`).version
    const updatePost = ctx.assert(
      require(`${ctx.henta.botdir}/updates.json`)[version],
      'Данная версия не найдена.'
    )

    ctx.answer({
      message: `📑 Версия: ${version}`,
      attachment: updatePost
    })
  }
}
