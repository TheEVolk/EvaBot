module.exports = function ({ getPlugin }) {
  const usersPlugin = getPlugin('common/users')

  this.addMethod('addMember', (self, vkId) => this.ClanMember.create({ vkId, clanId: self.id }))
  this.addMethod('getOwner', (self) => usersPlugin.findUser(self.ownerVkId))
  this.addMethod('getKd', ({ wins, defeats }) => Number((wins / defeats).toFixed(2)) || 0)
  this.addMethod('getMembersCount', ({ id }) => this.ClanMember.count({ where: { clanId: id } }))
  this.addMethod('getMembers', async ({ id }) => {
    const memberList = await this.ClanMember.findAll({ where: { clanId: id } })
    return Promise.all(memberList.map(i => usersPlugin.getByVkId(i.vkId)))
  })

  this.addMethod('getTopPosition', ({ id }) => {
    return id
  })
}
