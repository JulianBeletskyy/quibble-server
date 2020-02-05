import { uuid } from 'uuidv4'
import { Game, Player } from '../models'
import { io } from '../index'
import axios from 'axios'
import FormData from 'form-data'
import request from 'request'
import Instagram from '../services/instagram'

const APP_ID = '484722455566938'
const APP_SECRET = '1148f39830a6989a09b609be0fd798e0'
const REDIRECT_URL = 'https://localhost:3000/'

const instaClient = new Instagram({APP_ID, APP_SECRET, REDIRECT_URL})

export const instagram = async (req, res) => {
	const { code } = req.body
	instaClient.getAccessToken(code)
		.then(({access_token}) => {
			instaClient.me().then(result => {
				res.status(200).json(result)
			})
		})
		.catch(error => {
			res.status(error.code).json(error)
		})
}

export const create = async (req, res) => {
	const gameId = uuid()
	const game = await Game.create({
		game_id: gameId,
	})
	res.status(200).json({data: game})
}

const getGame = async gameId => {
	return await Game.findAll({
		where: { game_id: gameId },
		limit: 1,
		plain: true,
		attributes: [['game_id', 'gameId']],
		include: [
			{
				model: Player,
				as: 'players',
				attributes: ['name', 'owner', ['team_id', 'teamId'], ['player_id', 'userId']]
			}
		]
	})
}

export const get = async (req, res) => {
	const { gameId } = req.params
	const game = await getGame(gameId)
	if (game) {
		return res.json({game})
	}
	return res.status(400).json({message: 'Game not found'})
}

export const connect = async (req, res) => {
	const { gameId, userId } = req.params
	const [player] = await Player.findOrCreate({
		where: {
			player_id: userId,
			game_id: gameId,
		},
		defaults: {
			player_id: userId,
			game_id: gameId,
    	name: '',
    	owner: false,
  	},
  	attributes: [['player_id', 'playerId'], 'name', 'owner'],
  	raw: true,
	})
	const game = await getGame(gameId)
	return res.json({game})
}

export const updatePlayer = async (req, res) => {
	const { name } = req.body
	const { gameId, playerId } = req.params
	const [,player] = await Player.update({
		name,
	}, {
		where: {
			game_id: gameId,
			player_id: playerId
		},
		returning: true,
		plain: true,
	})
	const data = {
		name: player.name,
		playerId: player.player_id,
		owner: player.owner,
	}
	io.of('/').to(gameId).emit('updatePlayer', {player: data })
	res.status(200).send()
}

export const toggleReady = async (req, res) => {
	const { gameId, playerId } = req.params
	const { ready } = req.body
	io.of('/').to(gameId).emit('changeReady', {playerId, ready})
}

export const isExistGame = async gameId => {
	const count = await Game.count({where: {game_id: gameId}})
	return !!count
}
