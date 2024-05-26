import http from "http";
import http2 from "http2";
import { Server } from "socket.io";

export const injectSocketIO = (server: http.Server | http2.Http2SecureServer) => {
  const io = new Server(server);
  io.on("connection", (socket) => {
    socket.on("start", (data) => {
      console.log(data);
    });
    socket.on("frame", (data: string) => {
      socket.emit("yolo", data); // TODO
    });
  });
};
