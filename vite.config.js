import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Load env variables (.env)
export default defineConfig({
  plugins: [react()],

  // Ensures Vercel + local development run identically
  server: {
    port: 3000,
    host: true,           // allows access from LAN
    open: true,           // auto-opens browser
  },

  // Required for Vercel static deployment
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },

  // Ensures correct asset path resolution
  resolve: {
    alias: {
      "@": "/src",
    },
  },

  // Optional: Dev-only backend proxy (for localhost)
  // Remove this if not needed
  // proxy: {
  //   '/api': {
  //     target: 'https://anonymousananta-jif-backend.hf.space',
  //     changeOrigin: true,
  //     secure: false,
  //     rewrite: (path) => path.replace(/^\/api/, '')
  //   }
  // },

  // Needed for GitHub Pages / Vercel correctness
  base: "/", 
});
