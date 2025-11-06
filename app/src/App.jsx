// 라우팅 설정: Home과 Image 페이지 라우트 추가
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Image from './pages/Image.jsx';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image" element={<Image />} />
      </Routes>
    </>
  );
}
