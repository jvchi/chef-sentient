import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr({
    // svgr options: https://react-svgr.com/docs/options/
    svgrOptions: {
      // Example options
      icon: true, // Removes width/height and adds viewBox if missing
      // You can add more SVGO plugins here
    },
  })],
  optimizeDeps: {
    exclude: ['lightningcss']
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
