export default class {
  constructor (henta) {
    Object.assign(this, {
      name: 'лотерея',
      description: 'лотерея с числом',
      emoji: '🔟',
      arguments: {
        rate: { name: 'ставка', type: 'moneys' }
      }
    })
  }

  async handler (ctx) {
    ctx.assert(ctx.user.getRoleValue('maxGame') >= ctx.params.rate, 'Ставка слишком высока для вас.')
    const isWin = Math.random() > 0.7
    const coff = Math.random() > 0.9 ? 3 : 2

    ctx.user.money -= ctx.params.rate
    if (isWin) {
      ctx.user.money += ctx.params.rate * coff
      await ctx.user.unlockAchievementIf('firstWinOnLottery', ctx.params.rate >= 10000)
    }

    ctx.builder()
      .text(`${isWin ? `победа X${coff}` : 'поражение.'}`, { sendName: true })
      .textButton({
        label: 'Сыграть ещё',
        color: 'positive',
        payload: {
          sbs: {
            command: 'лотерея',
            titles: ['На сколько бит вы хотите сыграть?']
          }
        }
      })
      .answer()
  }
}
