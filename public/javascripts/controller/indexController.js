app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {
    $scope.messages = [];
    $scope.players = { };

    $scope.init = () => {
        const username = prompt('Please enter username');

        if (username) {
            initSocket(username);
        }
        else {
            return false;
        }
    };

    const initSocket = username => {
        const reconnectOptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 600
        };
    
        indexFactory.connectSocket('http://localhost:3000', reconnectOptions)
            .then(socket => {
                socket.emit('newUser', { username });

                socket.on('initPlayers', players => {
                    $scope.players = players;
                    $scope.$apply();
                });
                
                socket.on('newUser', user => {
                    const messageData = {
                        type: {
                            code: 0, // server / user message 
                            message: 1 // login / disconnect
                        },
                        username: user.username
                    };

                    $scope.messages.push(messageData);
                    $scope.players[user.id] = user;
                    $scope.$apply();
                });

                socket.on('disconnectUser', user => {
                    if (!user) {
                        return;
                    }

                    const messageData = {
                        type: {
                            code: 0,
                            message: 0
                        },
                        username: user.username
                    };

                    $scope.messages.push(messageData);
                    delete $scope.players[user.id];
                    $scope.$apply();
                });
            }).catch(err => {
                console.log(err);
            });
    }
}]);
