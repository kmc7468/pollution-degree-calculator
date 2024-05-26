import { type ViteDevServer } from "vite";

import { injectSocketIO } from "./socket";

export default {
  name: "socket.io",
  configureServer(server: ViteDevServer) {
    if (!server.httpServer) {
      throw new Error("No http server instance found.");
    }

    injectSocketIO(server.httpServer);
  }
};
