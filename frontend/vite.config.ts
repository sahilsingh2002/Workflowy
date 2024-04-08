import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
export default defineConfig({
  server:{
    port:3000,
    proxy:{
      "/api":{
        target: "http://localhost:7000",
				changeOrigin: true,
				secure: false,
      }
    }
  },
  
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

