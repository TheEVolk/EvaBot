import { Keyboard } from 'vk-io'

export default class {
  name = 'меню'
  description = 'навигация по боту'
  emoji = '🗺'

  async handler (ctx) {
    // const pet = await ctx.user.getPet()

    // const clanEmoji = await ctx.user.hasClan() ? '🛡' : '⭕'
    // const jobEmoji = await ctx.user.job ? '💼' : '⭕'
    // const petEmoji = pet ? pet.getType().emoji : '⭕'

    ctx.builder()
      .text('🗺 Пользуйтесь кнопками для навигации.')
      .keyboard(Keyboard.builder()
        .textButton({ label: `👀 Профиль`, payload: { command: 'профиль' } })
        .textButton({ label: `🏅 Ачивки`, payload: { command: 'ачивки' } })
        .row()
        // .textButton({ label: `${petEmoji} Питомец`, payload: { command: 'пит' } })
        // .textButton({ label: `${jobEmoji} Работа`, payload: { command: 'работа' } })
        // .row()
        // .textButton({ label: '🏙 Город', payload: { command: 'город' } })
      )
      .answer({ mainMenu: false })
  }
}
