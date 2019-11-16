import Sequelize from 'sequelize';

module.exports = {
  name: Sequelize.STRING,
  type: Sequelize.STRING,
  ownerVkId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
  variety: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
  force: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
  rating: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
};
