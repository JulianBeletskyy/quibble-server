import express from 'express'
import { create, get, connect, updatePlayer, toggleReady, getGame } from '../controllers/GameController'
const gameRoutes = express.Router()

gameRoutes.get('/create', create)
// gameRoutes.post('/instagram', instagram)
gameRoutes.get('/:gameId', get)
gameRoutes.get('/:gameId/connect/:userId', connect)
gameRoutes.post('/:gameId/player/:playerId/update', updatePlayer)
gameRoutes.post('/:gameId/player/:playerId/ready', toggleReady)

export default gameRoutes