import { Keyboard } from 'vk-io'

module.exports = function ({ vk }) {
  return {
    notPet: {
      message: [
        '🐾 У вас всё еще нет питомца.',
        'vk.com/@evarobotgroup-pets'
      ],
      keyboard: Keyboard.builder().oneTime(true)
        .textButton({ label: '🌷 Приют', payload: { botcmd: 'приют' } })
    },
    busyErrorGame: {
      message: '🐾 Ваш питомец занят игрой.',
      keyboard: Keyboard.builder().oneTime(true)
        .textButton({ label: 'Назад', payload: { botcmd: 'пит' } })
    },
    busyErrorDuel: {
      message: '🐾 Ваш питомец занят дуэлью.',
      keyboard: Keyboard.builder().oneTime(true)
        .textButton({ label: 'Назад', payload: { botcmd: 'пит' } })
    }
  }
}
