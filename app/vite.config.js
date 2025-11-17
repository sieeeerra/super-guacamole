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
  },
  // 빌드 시 청크 크기 경고 제한 조정
  build: {
    chunkSizeWarningLimit: 1000 // 1000KB (1MB)로 경고 임계값 설정
  }
});
