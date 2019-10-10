class ChatActionsPlugin {
  constructor(henta) {
      this.henta = henta;
  }

  init(henta) {
      // henta.hookManager.add('vk_message_new', this.onNewMessage.bind(this));
  }

  async onNewMessage(msg) {
    const groupId = this.henta.getConfigValue('vk_groupid');


    if (!msg.action)
      return;

    const ctx = this.henta.getPlugin('common/ctx').create(msg);

    switch (msg.action.type) {
      case 'chat_invite_user':
      case 'chat_kick_user':
      case 'chat_pin_message':
      case 'chat_unpin_message':
      case 'chat_unpin_message':
        this.henta.hookManager.run(`ca_${msg.action.type}:${msg.action.email || msg.action.member_id}`, ctx);
        if (msg.action.member_id == -this.henta.getConfigValue('vk_groupid'))
          this.henta.hookManager.run(`ca_${msg.action.type}:self`, ctx);
      default:
        this.henta.hookManager.run(`ca_${msg.action.type}`, ctx);
    }
  }
}

module.exports = ChatActionsPlugin;
