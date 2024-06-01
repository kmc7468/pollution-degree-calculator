import ioClient from "socket.io-client";

export const webSocket = ioClient("http://localhost:3000");

export interface YoloObject {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  score: number;
  label: string;
}

export interface YoloPayload {
  image: string;
  objects: YoloObject[];
  timestamp: number;
  throughput: number;
}
