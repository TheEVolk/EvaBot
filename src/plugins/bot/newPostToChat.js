class NewPostToChatPlugin {
  init(henta) {
    henta.vk.on('wall_post_new', (post) => {
      henta.vk.api.messages.send({
        message: "📢 Новая запись в группе!",
        peer_id: 2000000002,
        attachment: `wall${post.owner_id}_${post.id}`
      })
    })
  }
}

module.exports = NewPostToChatPlugin
