const server = require('http').createServer().listen(3000);
const io = require('socket.io')(server, {
    cors: true,
    origin: "http://localhost:3000",
})

const users = {}

io.on('connection', socket => {
  socket.on('new-user', names => {
    users[socket.id] = names
    socket.broadcast.emit('user-connected', names)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, names: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})