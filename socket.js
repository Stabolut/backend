const SocketIO = require('socket.io');


module.exports = (server) => {
    const io = SocketIO(server);
    let usersArray = [];

    const getUser = (userId) => {
        return usersArray.find((user) => user.userId === userId);
    };

    const addUser = (userId, socketId) => {
        usersArray = usersArray.filter(item => item.userId !== userId);
        usersArray.push({ userId, socketId });
    };

    io.on('connection', (socket) => {

        socket.on("addUser", (userAddress) => {
            addUser(userAddress.address, socket.id);

        });

        socket.on("transferEvent", (data) => {
            let user = getUser(data.receiverAddress)
            if (user) {
                io.to(user.socketId).emit("getTransaction", {
                    data
                });
            }
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};