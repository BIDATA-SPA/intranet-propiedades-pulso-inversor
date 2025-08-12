import appConfig from '@/configs/app.config'
import io from 'socket.io-client'

const socket = io(appConfig.socketUrl)

socket.on('connect', () => {
  console.log('Connected to WebSocket server')
})

export default socket
