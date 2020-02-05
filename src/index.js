import http from 'http'
import https from 'https'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import config from './config.json'
import socket from 'socket.io'
import apiRoutes from './routes'
import { isExistGame } from './controllers/GameController'
import { getPlayer, getGamePlayers } from './controllers/PlayerController'
require('babel-polyfill');

const app = express();
app.server = http.createServer(app);
export const io = socket.listen(app.server)

// const fs = require('fs')
// const path = require('path')
// const url = require('url')

// const dir = path.join(__dirname, '../../../ssl')
// const options = {
//   key: fs.readFileSync(`${dir}/medtrade.da.key`),
//   cert: fs.readFileSync(`${dir}/medtrade.da.crt`)
// };

// https.createServer(options, (req, res) => {
//   const queryObject = url.parse(req.url,true).query;
//   res.writeHead(301, {Location: `http://localhost:3000?code=${queryObject.code}`})
//   res.end()
// }).listen(443)

app.use(morgan('dev'));

app.use(cors({
	exposedHeaders: config.corsHeaders
}))

app.use(bodyParser.json({
	limit : config.bodyLimit
}))

app.use('/api/v1', apiRoutes)

const getUsersInRoom = roomId => {
  const connected = io.of('/').in(roomId).connected
  return Object.keys(connected).map(socketId => connected[socketId].nickname)
}

io.on('connection', async socket => {
  const { roomId, userId } = socket.handshake.query
  socket.nickname = userId
  socket.join(roomId)
  const userIds = getUsersInRoom(roomId)
  socket.emit('connectSuccess', {userIds})
  socket.broadcast.to(roomId).emit('newUserConnect', {userId})

  socket.on('disconnect', () => {
    socket.broadcast.to(roomId).emit('userLeaveRoom', {userId})
  })
})

app.listen(process.env.PORT || config.port, () => {
	console.log(`Started on port ${app.server.address().port}`)
})

app.server.listen(6001, () => {
	console.log('Socket listen on localhost:6001')
})

export default app
