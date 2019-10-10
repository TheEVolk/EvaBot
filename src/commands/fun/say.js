import googleTTS from 'google-tts-api'

export default class {
  constructor () {
    Object.assign(this, {
      name: 'скажи',
      aliases: ['вслух'],
      description: 'текст в речь',
      emoji: '💭',
      arguments: {
        text: { name: 'текст', type: 'string', max: 200 }
      }
    })
  }

  async handler (ctx) {
    ctx.builder()
      .audioMessage(await googleTTS(ctx.params.text, 'ru', 1.1))
      .answer()
  }
}
