module.exports = function ({ getPlugin }) {
  const usersPlugin = getPlugin('common/users')

  usersPlugin.addMethod('getPet', (self) => this.Pet.findOne({ where: { ownerVkId: self.vkId } }))
  usersPlugin.addMethod('assertPet', async (self, ctx, type, err) => {
    switch (type) {
      case 'has':
        return ctx.assert(
          await self.getPet(),
          err || [`⛔ Вы должны иметь питомца.`, '➤ Заведите питомца с помощью меню.']
        )
      case 'free':
        ctx.assert(
          !await self.getPet(),
          err || `⛔ Вы не должны иметь питоца.`
        )
        break
    }
  })
}
