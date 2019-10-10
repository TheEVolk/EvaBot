module.exports = async function ({ getPlugin }) {
  const redisPlugin = getPlugin('common/redis')

  return {
    generate: async (vkId, petType) => {
      const sex = Math.random() > 0.5
      const names = petType.names[sex ? 'female' : 'male']

      const pet = {
        type: petType.tag,
        sex,
        name: names[Math.floor(Math.random() * names.length)],
        variety: Math.floor(Math.random() * petType.varieties.length),
        price: 1e4 + Math.floor(Math.random() * 5e4)
      }

      await redisPlugin.setObject(`shelter:${vkId}`, pet)
      return pet
    },

    buy: async (ctx) => {
      const petInfo = ctx.assert(
        await redisPlugin.getObject(`shelter:${ctx.user.vkId}`),
        {
          message: '⛔ Выберите питомца в приюте.',
          keyboard: ctx.keyboard()
            .textButton({ label: `🌷 В приют`, payload: { botcmd: `приют` }, color: 'positive' })
        }
      )

      ctx.user.buy(ctx, petInfo.price)

      delete petInfo.price
      petInfo.ownerVkId = ctx.user.vkId
      return this.createPet(petInfo)
    }
  }
}
