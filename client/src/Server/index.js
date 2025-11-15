import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const usersInRoom = {}; // roomId -> array of users

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    if (!usersInRoom[roomId]) usersInRoom[roomId] = [];
    usersInRoom[roomId].push({ id: socket.id, name: username });

    io.to(roomId).emit("users-update", usersInRoom[roomId]);
  });

  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {
      if (usersInRoom[roomId]) {
        usersInRoom[roomId] = usersInRoom[roomId].filter(
          (u) => u.id !== socket.id
        );
        io.to(roomId).emit("users-update", usersInRoom[roomId]);
      }
    });
  });
});

server.listen(5001, () => {
  console.log("Server running on port 5001");
});
