import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // YEH HAI WOH WEAPON JO DUPLICATE REACT KO MAAREGA
    dedupe: [
      'react', 
      'react-dom', 
      'three', 
      '@react-three/fiber', 
      '@react-three/drei'
    ]
  },
  build: {
    chunkSizeWarningLimit: 1600, // Yeh Vercel ke warnings ko chup karwayega
  }
})
