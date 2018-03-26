const socketio = require('socket.io');
const io = socketio({ wsEngine: 'ws' });

const socketApi = { io };

io.on('connection', socket => {
    console.log('A user connected');
});

module.exports = socketApi;