app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {
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
                console.log('Bağlantı gerçekleşti', socket);
            }).catch(err => {
                console.log(err);
            });
    }
}]);
