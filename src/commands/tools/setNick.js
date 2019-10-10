export default class {
  constructor (henta) {
    Object.assign(this, {
      name: 'сетник',
      description: 'измените чужой никнейм',
      type: 'main',
      arguments: {
        target: { name: 'игрок', type: 'user' },
        nick: { name: 'текст', type: 'string' }
      },
      emoji: '🎩',
      right: 'setNick'
    })
  }

  handler (ctx) {
    ctx.assert(ctx.params.target.nickName !== ctx.params.nick, 'у вас и так такой никнейм :)')
    ctx.params.target.nickName = ctx.params.nick
    ctx.answer(`Новый никнейм для ${ctx.params.target.r()} >> ${ctx.params.nick}. :)`)
  }
}
