import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store rooms with users and code
const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = { users: [], code: "// Start coding here..." };

    // Add user to room
    rooms[roomId].users.push({ id: socket.id, name: username });

    // Send updated user list to all clients in the room
    io.to(roomId).emit("users-update", rooms[roomId].users);

    // Send current code to new user
    socket.emit("code-update", rooms[roomId].code);

    console.log(`${username} joined room ${roomId}`);
  });

  // Code change event
  socket.on("code-change", ({ roomId, code }) => {
    if (rooms[roomId]) {
      rooms[roomId].code = code;
      socket.to(roomId).emit("code-update", code);
    }
  });

  // Chat 1 message
  socket.on("chat1-message", ({ roomId, message, name }) => {
    io.to(roomId).emit("chat1-message", { message, name });
  });

  // Chat 2 message
  socket.on("chat2-message", ({ roomId, message, name }) => {
    io.to(roomId).emit("chat2-message", { message, name });
  });

  // Disconnect
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      room.users = room.users.filter((user) => user.id !== socket.id);

      // Update users list
      io.to(roomId).emit("users-update", room.users);

      // Optional: clean up empty rooms
      if (room.users.length === 0) {
        delete rooms[roomId];
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
