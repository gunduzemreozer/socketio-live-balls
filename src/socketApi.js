const socketio = require('socket.io');
const io = socketio();

const users = { };

// helpers
const getRandomColor = require('../helpers/randomColor');

const socketApi = { io };
io.on('connection', socket => {
    socket.on('newUser', data => {
        const defaultUserData = {
            id: socket.id,
            position: { x: 0, y: 0 },
            color: getRandomColor()
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

    socket.on('positionChange', position => {
        const user = users[socket.id];
        try {
            user.position.x = position.x;
            user.position.y = position.y;

            socket.broadcast.emit('userPositionChanged', user);
        }
        catch(err) {
            console.log(err);
        }
    });

    socket.on('newMessage', messageData => {
        socket.broadcast.emit('newMessageReceived', messageData);
    });
});

module.exports = socketApi;