// 기본 설정
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Sass legacy API deprecation 경고 해결을 위한 modern API 설정
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // modern API 사용
      }
    }
  }
});
