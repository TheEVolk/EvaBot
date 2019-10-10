export default class {
  constructor (henta) {
    Object.assign(this, {
      henta: henta,
      name: 'настройки',
      right: 'profileSettings',
      emoji: '⚙',
      aliases: ['сеттинги', 'настройка'],
      subcommands: {
        профиль: { handler: this.closeProfile.bind(this) },
        перевод: { handler: this.receiveMoney.bind(this) }
      },
      type: 'main',
      description: 'настройте свой профиль'
    })
  }

  closeProfile (ctx) {
    if (ctx.user.isProfileClosed) {
      ctx.user.isProfileClosed = false
      ctx.answer({
        message: '✅ Вы открыли свой профиль.',
        keyboard: this.henta.vk.Keyboard.builder()
          .textButton({ label: '⚙ Настройки профиля', payload: { botcmd: 'настройки' } }).oneTime(true)
      },
      { sendName: false })
    } else {
      ctx.user.isProfileClosed = true
      ctx.answer({
        message: '❎ Вы закрыли свой профиль.',
        keyboard: this.henta.vk.Keyboard.builder()
          .textButton({ label: '⚙ Настройки профиля', payload: { botcmd: 'настройки' } }).oneTime(true)
      },
      { sendName: false })
    }
  }

  receiveMoney (ctx) {
    if (ctx.user.canReceiveMoney) {
      ctx.user.canReceiveMoney = false
      ctx.answer({
        message: '❎ Вы запретили перевод бит на свой счёт.',
        keyboard: this.henta.vk.Keyboard.builder()
          .textButton({ label: '⚙ Настройки профиля', payload: { botcmd: 'настройки' } }).oneTime(true)
      },
      { sendName: false })
    } else {
      ctx.user.canReceiveMoney = true
      ctx.answer({
        message: '✅ Вы разрешили перевод бит на свой счёт.',
        keyboard: this.henta.vk.Keyboard.builder()
          .textButton({ label: '⚙ Настройки профиля', payload: { botcmd: 'настройки' } }).oneTime(true)
      },
      { sendName: false })
    }
  }

  handler (ctx) {
    ctx.answer({
      message: [
        `⚙️ Настройки профиля «${ctx.user.r()}»:`,
        ctx.user.isProfileClosed ? '👁️‍🗨️ >> ❎' : '👁️‍🗨️ >> ✅',
        ctx.user.canReceiveMoney ? '💳 >> ✅' : '💳 >> ❎'
      ],
      keyboard: this.henta.vk.Keyboard.builder()
        .textButton({ label: 'Приватность профиля', payload: { botcmd: 'настройки профиль' } }).row()
        .textButton({ label: 'Перевод бит', payload: { botcmd: 'настройки перевод' } }).oneTime(true)
    })
  }
}
