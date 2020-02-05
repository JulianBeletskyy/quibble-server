'use strict';

export default (sequelize, DataTypes) => {
  const Player = sequelize.define(
  	'Player',
  	{
    	player_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    	game_id: DataTypes.STRING,
    	team_id: DataTypes.STRING,
    	name: DataTypes.STRING,
    	owner: DataTypes.BOOLEAN,
  	},
  	{
  		createdAt: 'created_at',
  		updatedAt: 'updated_at',
  	})
  Player.associate = models => {
    Player.belongsTo(models.Game, {
  		as: 'game',
  		foreignKey: 'game_id',
      targetKey: 'game_id',
  		onDelete: 'CASCADE',
    })
    Player.belongsTo(models.Team, {
  		as: 'team',
  		foreignKey: 'team_id',
  		onDelete: 'CASCADE',
    })
  }
  return Player
}