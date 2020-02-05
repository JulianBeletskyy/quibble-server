'use strict';
export default (sequelize, DataTypes) => {
  const Team = sequelize.define(
  	'Team',
  	{
	    game_id: DataTypes.STRING,
	    name: DataTypes.STRING
  	},
  	{
	  	createdAt: 'created_at',
			updatedAt: 'updated_at',
  	}
  )
  Team.associate = models => {
    Team.hasMany(models.Player, {
      foreignKey: 'team_id',
      as: 'players',
    })
  }
  return Team
}