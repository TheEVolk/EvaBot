export default class OnlineStatusPlugin {
  init (henta) {
    // this.enableOnline(henta)
    setInterval(() => this.enableOnline(henta), 900e3)
  }

  enableOnline (henta) {
    henta.log(`Включаю онлайн сообщества...`)
    henta.vk.api.groups.enableOnline({ group_id: henta.groupId })
  }
}
