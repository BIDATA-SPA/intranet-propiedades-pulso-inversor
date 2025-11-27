import appConfig from '@/configs/app.config'
import io from 'socket.io-client'

const socket = io(appConfig.socketUrl)

socket.on('connect', () => {})

export default socket
