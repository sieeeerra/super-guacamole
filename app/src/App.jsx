// 라우팅 설정: Home, Image, Contact, Video, Work 페이지 라우트 추가
// 404 Not Found 페이지 라우트 추가
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Work from './pages/Work.jsx';
import Image from './pages/Image.jsx';
import Video from './pages/Video.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/image" element={<Image />} />
        <Route path="/video" element={<Video />} />
        <Route path="/contact" element={<Contact />} />
        {/* 존재하지 않는 경로에 대한 404 페이지 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
