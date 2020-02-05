'use strict'

export default (sequelize, DataTypes) => {
  const Game = sequelize.define(
  	'Game',
  	{
    	game_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: true,
      },
      finished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
  	},
  	{
  		createdAt: 'created_at',
  		updatedAt: 'updated_at',
		}
	)
	Game.associate = models => {
		Game.hasMany(models.Player, {
      foreignKey: 'game_id',
      sourceKey: 'game_id',
      as: 'players',
    })
	}
  return Game
}