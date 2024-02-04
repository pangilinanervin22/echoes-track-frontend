import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "Echoes Track",
        short_name: "PWA",
        description: "Rfid based attendance system",
        theme_color: "#ffffff",
        icons: [
          {
            src: "cvsu.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "cvsu.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    })
  ],
})
