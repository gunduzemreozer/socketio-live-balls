app.controller('indexController', ['$scope', 'configFactory', 'indexFactory', ($scope, configFactory, indexFactory) => {
    const divGameArea = $('div.gameArea');

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
    }

    const scrollChatArea = () => {
        setTimeout(() => {
            const chatAreaRef = $('#chat-area');
            chatAreaRef.prop('scrollTop', chatAreaRef.prop('scrollHeight'));
        });
    }

    const showBubble = (id, message) => {
        const divMessage = $(`#${id}`).find('.message');
        divMessage.html(message).show();
        setTimeout(() => {
            divMessage.hide()
        }, 2000);
    };

    const initSocket = async (username) => {
        const reconnectOptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 600
        };
    
        let socket;
        try {
            const config = await configFactory.getConfig();
            const { socketUrl } = config.data;
            socket = await indexFactory.connectSocket(socketUrl, reconnectOptions);
        }
        catch (err) {
            console.log(err);
            return;
        }

        socket.emit('newUser', { 
            username
        });

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

            scrollChatArea();
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

            scrollChatArea();
        });

        socket.on('userPositionChanged', user => {
            $(`#${user.id}`).animate({ 'top': user.position.y, 'left': user.position.x });
        });

        socket.on('newMessageReceived', messageData => {
            $scope.messages.push(messageData);
            $scope.$apply();

            scrollChatArea();
            showBubble(messageData.id, messageData.type.message);
        });

        socket.on('reconnect', () => {
            initSocket(username);
        });

        let animating = false;
        $scope.onClickGameArea = $event => {
            if (!animating) {
                let x = $event.offsetX - 40;
                let y = $event.offsetY - 40;

                socket.emit('positionChange', { x, y });

                animating = true;
                $(`#${socket.id}`).animate({ 'top': y, 'left': x }, () => {
                    animating = false;                            
                });
            }
        }

        $scope.newMessage = () => {
            let message = $scope.message;
            const messageData = {
                type: {
                    code: 1, // server / user message 
                    message
                },
                username,
                id: socket.id
            };

            $scope.messages.push(messageData);
            $scope.message = '';
            scrollChatArea();
            showBubble(socket.id, message);

            socket.emit('newMessage', messageData);
        };
    }
}]);
