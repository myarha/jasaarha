import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/jasaarha/', // Ganti NAMA_REPO_ANDA dengan nama repository Anda di GitHub
})