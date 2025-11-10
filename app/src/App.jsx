// 라우팅 설정: Home, Image, Contact, Video 페이지 라우트 추가
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Image from './pages/Image.jsx';
import Contact from './pages/Contact.jsx';
import Video from './pages/Video.jsx';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image" element={<Image />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/video" element={<Video />} />
      </Routes>
    </>
  );
}
