// 라우팅 설정: Home, Image, Contact, Video, Work 페이지 라우트 추가
// GA4 페이지뷰 추적 추가
// Vercel Web Analytics 추가
// 페이지 트랜지션 overlay 추가
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header.jsx';
import PageTransition from './components/PageTransition.jsx';
import Home from './pages/Home.jsx';
import Work from './pages/Work.jsx';
import Image from './pages/Image.jsx';
import Video from './pages/Video.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  const location = useLocation();
  // 정의된 라우트 경로 목록
  const validPaths = ['/', '/work', '/image', '/video', '/contact'];
  // 현재 경로가 정의된 라우트인지 확인
  const showHeader = validPaths.includes(location.pathname);

  // GA4 페이지뷰 추적: 페이지 전환 시 자동으로 페이지뷰 전송
  useEffect(() => {
    // 페이지 이동 시 스크롤을 최상단으로 이동
    window.scrollTo(0, 0);
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-P4R3F1D36V', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return (
    <>
      <PageTransition>
        {showHeader && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/image" element={<Image />} />
          <Route path="/video" element={<Video />} />
          <Route path="/contact" element={<Contact />} />
          {/* 존재하지 않는 경로에 대한 404 페이지 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Vercel Web Analytics: 페이지뷰 및 성능 메트릭 자동 수집 */}
        <Analytics />
      </PageTransition>
    </>
  );
}
