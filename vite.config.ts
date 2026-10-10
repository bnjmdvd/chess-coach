import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Lesson content is bundled with the app (~220 kB gzipped); that's fine for a learning app.
  build: { chunkSizeWarningLimit: 1200 },
});
