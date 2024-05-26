import ioClient from "socket.io-client";

export const webSocket = ioClient("http://localhost:3000");
