import express from "express";
import http from "http";
import { Server } from "socket.io";
import ACTIONS from "./src/Actions.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// socketId -> { username, roomId }
const userSocketMap = new Map();

// roomId -> { files: { filename: code } }
const roomCode = new Map();

function getAllConnectedClients(roomId) {
  const set = io.sockets.adapter.rooms.get(roomId) || new Set();
  return [...set].map((socketID) => ({
    socketID,
    username: userSocketMap.get(socketID)?.username || "Anonymous",
  }));
}

io.on("connection", (socket) => {
  console.log("✅ socket connected:", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap.set(socket.id, { username, roomId });
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    console.log("👥 clients in room:", roomId, clients);

    // notify joiner + others
    socket.emit(ACTIONS.JOINED, { username, clients, socketID: socket.id });
    socket.to(roomId).emit(ACTIONS.JOINED, { username, clients, socketID: socket.id });

    // Send stored room code (all files) to the newly joined client, if any
    const roomData = roomCode.get(roomId);
    if (roomData && roomData.files) {
      io.to(socket.id).emit(ACTIONS.SYNC_CODE, { files: roomData.files });
    }

    // When someone changes code -> update room snapshot & broadcast to others
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId: rId, filename, code }) => {
      if (!rId) rId = roomId; // fallback
      let data = roomCode.get(rId);
      if (!data) {
        data = { files: {} };
        roomCode.set(rId, data);
      }
      if (filename) data.files[filename] = code;
      // broadcast to others in room
      socket.to(rId).emit(ACTIONS.CODE_CHANGE, { filename, code });
    });

    // optional: forward a direct sync from one client to another (legacy peer-to-peer)
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, filename, code }) => {
      io.to(socketId).emit(ACTIONS.CODE_CHANGE, { filename, code });
    });
  });

  // fire before the socket actually leaves the rooms
  socket.on("disconnecting", () => {
    const info = userSocketMap.get(socket.id);
    if (info?.roomId) {
      socket.to(info.roomId).emit(ACTIONS.DISCONNECTED, {
        socketID: socket.id,
        username: info.username,
      });
    }
  });

  socket.on("disconnect", () => {
    const info = userSocketMap.get(socket.id);
    // if last user left the room, you can clear the stored code (optional)
    if (info?.roomId) {
      const room = io.sockets.adapter.rooms.get(info.roomId);
      if (!room || room.size === 0) {
        roomCode.delete(info.roomId);
      }
    }
    userSocketMap.delete(socket.id);
    console.log("❌ socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
