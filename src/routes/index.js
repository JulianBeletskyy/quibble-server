import express from 'express'
import gameRoutes from './game'
const apiRoutes = express.Router()

apiRoutes.get('/', (req, res) => res.status(200).json({
  message: 'Welcome to the API',
  v1: '/api/v1'
}))

apiRoutes.use('/game', gameRoutes)

export default apiRoutes