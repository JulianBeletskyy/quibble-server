require('babel-polyfill')
import { Player } from '../models'
import { Op } from 'sequelize'

export const getPlayer = async (playerId, gameId, owner) => {
	const [player] = await Player.findOrCreate({
		where: {
			player_id: playerId,
			game_id: gameId,
		},
		defaults: {
			player_id: playerId,
			game_id: gameId,
    	name: '',
    	owner,
  	},
  	attributes: [['player_id', 'playerId'], 'name', 'owner'],
  	raw: true,
	})
	return player
}

export const getGamePlayers = async (gameId, playerIds) => {
	return await Player.findAll({
		where: {
			game_id: gameId,
			player_id: {
				[Op.in]: playerIds,
			}
		},
		attributes: [['player_id', 'playerId'], 'name', 'owner'],
		raw: true,
	})
}