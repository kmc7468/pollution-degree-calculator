import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

import socketVitePlugin from "$lib/server/socketVitePlugin";

export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
    sveltekit(),
    socketVitePlugin
  ]
});