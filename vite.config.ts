import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(async () => ({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@icons": path.resolve(__dirname, "./src/assets/icons"),
      "@composables": path.resolve(__dirname, "./src/composables"),
      "@data": path.resolve(__dirname, "./src/data"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@utils": path.resolve(__dirname, "./src/utils"),

      "@common": path.resolve(__dirname, "./src/components/common"),
      "@ui": path.resolve(__dirname, "./src/components/ui"),

      "@channel": path.resolve(__dirname, "./src/components/blocks/channel"),
      "@header": path.resolve(__dirname, "./src/components/blocks/header"),
      "@settings": path.resolve(__dirname, "./src/components/blocks/settings"),
      "@upload": path.resolve(__dirname, "./src/components/blocks/upload"),
      "@video": path.resolve(__dirname, "./src/components/blocks/video"),
    },
  },

  clearScreen: false,
  server: {
    port: 5173,
    host: true,
  },
}));
