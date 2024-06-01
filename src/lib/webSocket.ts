import ioClient from "socket.io-client";

export const webSocket = ioClient("http://localhost:3000");

export interface YoloPayload {
  image: string;
  objects: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    score: number;
    label: string;
  }[];
  timestamp: number;
  throughput: number;
  utilization: number;
}
