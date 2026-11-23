import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 3000 doluysa başka porta geçmesin, hata versin (backend'in CORS izni bu adrese verilir)
  server: { port: 3000, strictPort: true }
});
