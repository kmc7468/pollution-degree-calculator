import http from "http";
import http2 from "http2";
import { Server } from "socket.io";

import { loadModel, detect } from "./yolov5";

export const injectSocketIO = async (server: http.Server | http2.Http2SecureServer) => {
  const model = await loadModel();
  let running = false;
  console.log("ready");

  const io = new Server(server);
  io.on("connection", (socket) => {
    socket.on("start", (data) => {
      console.log(data);
    });
    socket.on("frame", async (data: { image: string, timestamp: number }) => {
      if (!running) {
        running = true;

        const start = Date.now();
        const result = await detect(model, data.image);
        const end = Date.now();

        socket.emit("yolo", {
          image: data.image,
          objects: result,
          timestamp: data.timestamp,
          throughput: 1000 / (end - start)
        });

        running = false;
      }
    });
  });
};
