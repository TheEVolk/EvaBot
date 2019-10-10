module.exports = function ({ getPlugin }) {
  const usersPlugin = getPlugin('common/users')

  this.addMethod('getOwner', ({ ownerVkId }) => usersPlugin.findUser(ownerVkId))
  this.addMethod('getType', ({ type }) => this.typesFromTags[type])
  this.addMethod('getImage', (self) => this.imageGenerator.get(self))
  this.addMethod('generateImage', (self) => this.imageGenerator.generate(self))
}
