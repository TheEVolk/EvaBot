class ChatsPlugin {
  constructor (henta) {
    this.henta = henta
  }

  init (henta) {
    //  henta.hookManager.add('ca_chat_invite_user:self', this.onInvitedToChat.bind(this));
  }

  async onInvitedToChat (ctx) {
    ctx.send([
      '🦄 Я вас категорически приветствую.',
      '\nТеперь в вашей беседе будет намного веселее, ведь здесь поселилась прекрасная Ева Цифрова.',
      '\n📣 Со мной можно общаться:',
      '>> Упоминаниями (*evarobotgroup)',
      '>> Слешем (/)',
      '>> Или выдайте боту полный доступ к переписке и используйте привычные вам обращения (Ева)',
      '\nПо всем вопросам >> *evabottp(тык!)'
    ])
  }
}

module.exports = ChatsPlugin
