import { createServer, Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";

let io: IOServer | null = null;

export const initSocket = (server: HttpServer) => {
  io = new IOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", (payload: { userId: number | string }) => {
      const userId = typeof payload.userId === "string" ? parseInt(payload.userId, 10) : payload.userId;
      if (!Number.isNaN(userId)) {
        socket.join(`user_${userId}`);
      }
    });

    socket.on("leave", (payload: { userId: number | string }) => {
      const userId = typeof payload.userId === "string" ? parseInt(payload.userId, 10) : payload.userId;
      if (!Number.isNaN(userId)) {
        socket.leave(`user_${userId}`);
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io server is not initialized.");
  }
  return io;
};

export const getUserRoom = (userId: number) => `user_${userId}`;
