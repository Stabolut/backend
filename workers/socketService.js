// Import the Socket.IO library
const SocketIO = require("socket.io");

// Export a function to set up WebSocket server
module.exports = (server) => {
  // Create a new instance of Socket.IO server and attach it to the provided HTTP server
  const io = SocketIO(server);

  // Array to store connected users' information
  let usersArray = [];

  // Function to get user information by userId
  const getUser = (userId) => {
    return usersArray.find((user) => user.userId === userId);
  };

  // Function to add a user to the usersArray or update its socketId if already exists
  const addUser = (userId, socketId) => {
    console.log("Hit socker theree")
    // Remove any existing user entry with the same userId
    usersArray = usersArray.filter((item) => item.userId !== userId);
    // Add the new user entry
    usersArray.push({ userId, socketId });
  };

  // Event listener for incoming socket connections
  io.on("connection", (socket) => {
    console.log("socket connect")
    // Event listener to handle addUser event, which occurs when a new user connects
    socket.on("addUser", (userAddress) => {
      // Add the user to the usersArray with its socketId
      addUser(userAddress.address, socket.id);
    });

    // Event listener to handle transferEvent, which is emitted when a transfer occurs
    socket.on("transferEvent", (data) => {
      console.log("tranasfer event")
      // Find the user with the receiverAddress in usersArray
      let user = getUser(data.receiverAddress);
      if (user) {
        // If the user is found, emit a getTransaction event to the corresponding client
        io.to(user.socketId).emit("getTransaction", {
          data,
        });
      }
    });

    // Event listener for when a client disconnects from the WebSocket server
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
