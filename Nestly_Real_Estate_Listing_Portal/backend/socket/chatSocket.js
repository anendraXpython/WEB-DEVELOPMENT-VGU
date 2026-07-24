const Message = require("../models/Message");

// This function is called once from server.js, passing in the io instance.
// It's kept in its own file so server.js doesn't turn into a huge file
// mixing HTTP routes and socket logic together.
function registerChatSocket(io) {
  io.on("connection", (socket) => {
    console.log("chat client connected:", socket.id);

    // a client asks to join a specific chat room -- either a listing's
    // thread (roomId = listing id) or the general room (roomId = "general")
    socket.on("join room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("chat message", async (data) => {
      try {
        const roomId = data.listingId || "general";

        const saved = await Message.create({
          listingId: data.listingId || null,
          name: data.name || "Buyer",
          role: data.role === "agent" ? "agent" : "buyer",
          text: data.text,
        });

        // broadcast only to clients in the same room, not everyone connected
        io.to(roomId).emit("chat message", {
          _id: saved._id,
          listingId: saved.listingId,
          name: saved.name,
          role: saved.role,
          text: saved.text,
          createdAt: saved.createdAt,
        });
      } catch (error) {
        console.log("could not save chat message:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("chat client disconnected:", socket.id);
    });
  });
}

module.exports = registerChatSocket;
