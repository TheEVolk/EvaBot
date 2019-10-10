export default class {
  constructor (henta) {
    Object.assign(this, {
      name: 'ник',
      description: 'измените свой никнейм',
      type: 'main',
      arguments: {
        nick: { name: 'текст', type: 'string' }
      },
      emoji: '🎩'
    })
  }

  handler (ctx) {
    ctx.assert(ctx.user.nickName !== ctx.params.nick, 'у вас и так такой никнейм :)')
    ctx.assert(ctx.params.nick.length > 7, 'не маловато ли вам для никнейма? :/')
    ctx.user.buy(ctx, 100)
    ctx.user.nickName = ctx.params.nick
    ctx.answer(`Ваш новый никнейм >> ${ctx.params.nick}. :)`)
  }
}
