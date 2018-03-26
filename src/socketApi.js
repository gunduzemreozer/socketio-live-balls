const socketio = require('socket.io');
const io = socketio({ wsEngine: 'ws' });

const users = { };
const socketApi = { io };
io.on('connection', socket => {
    socket.on('newUser', data => {
        const defaultUserData = {
            id: socket.id,
            position: { x: 0, y: 0 }
        };

        const user = Object.assign(data, defaultUserData);
        users[socket.id] = user;

        socket.broadcast.emit('newUser', user);
        socket.emit('initPlayers', users);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('disconnectUser', users[socket.id]);
        delete users[socket.id];
    });
});

module.exports = socketApi;