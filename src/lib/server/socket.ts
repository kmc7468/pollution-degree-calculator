import http from "http";
import http2 from "http2";
import { Server } from "socket.io";

import { loadModel } from "./yolo";

export const injectSocketIO = async (server: http.Server | http2.Http2SecureServer) => {
  const model = await loadModel("yolov8m-trash");

  const io = new Server(server);
  io.on("connection", (socket) => {
    let running = false;

    socket.on("start", (data) => {
      console.log(data);
    });
    socket.on("frame", async (data: { image: string, timestamp: number }) => {
      if (!running) {
        running = true;

        const start = Date.now();
        const result = await model.detect(data.image);
        const end = Date.now();

        socket.emit("yolo", {
          image: data.image,
          objects: result,
          timestamp: data.timestamp,
          throughput: 1000 / (end - start),
        });

        running = false;
      }
    });
  });
};
