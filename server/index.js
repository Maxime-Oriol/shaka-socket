const express = require('express');
const http = require('http');
const cors = require('cors');

const { Server } = require('socket.io')

const app = express();
app.use(cors());

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket) => {
    console.log('User is connected : ',socket.id);

    socket.on('set_config', (message) => {
        socket.to(message.room).emit('receive_config', message.data)
    })

    socket.on('join', (data) => {
        socket.join(data)
        console.log('User joined : ',socket.rooms)
    })

    socket.on('disconnecting', () => {
        console.log('User ',socket.id,' disconnected from ', socket.rooms)
    });
})

server.listen(3001, () => {
    console.log('Socket server is running');
})