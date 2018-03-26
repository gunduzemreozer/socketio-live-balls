const socketio = require('socket.io');
const io = socketio({ wsEngine: 'ws' });

const users = [];
const socketApi = { io };
io.on('connection', socket => {
    socket.on('newUser', data => {
        const defaultUserData = {
            id: socket.id,
            position: { x: 0, y: 0 }
        };

        const user = Object.assign(data, defaultUserData);
        console.log(user);

        users.push(user);
    });
});

module.exports = socketApi;