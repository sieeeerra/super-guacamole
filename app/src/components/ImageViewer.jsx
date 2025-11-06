// imageViewer modal component
import { useEffect, useRef } from 'react';

export default function ImageViewer({ isOpen, imageData, onClose }) {
  // 이전 스크롤 위치를 저장하기 위한 ref
  const scrollPositionRef = useRef(0);

  // 모달 열림/닫힘에 따른 배경 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때: 현재 스크롤 위치 저장 및 배경 스크롤 막기
      scrollPositionRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
    } else {
      // 모달이 닫힐 때: 스크롤 위치 복원 및 배경 스크롤 활성화
      // 스타일을 제거하기 전에 스크롤 위치를 먼저 설정하여 화면 이동 방지
      document.documentElement.style.scrollBehavior = 'auto';
      document.documentElement.scrollTop = scrollPositionRef.current;
      window.scrollTo(0, scrollPositionRef.current);
      
      // 스타일 제거
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      document.documentElement.style.removeProperty('scroll-behavior');
      
      // 다음 프레임에서 스크롤 위치 재확인 (레이아웃 변경 후)
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
      });
    }

    // 컴포넌트 언마운트 시 스타일 정리
    return () => {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      document.documentElement.style.removeProperty('scroll-behavior');
    };
  }, [isOpen]);

  // 이미지 데이터가 없으면 렌더링하지 않음
  if (!isOpen || !imageData) {
    return null;
  }

  // 프롬프트 텍스트 복사
  const handleCopyPrompt = () => {
    if (imageData.img_description) {
      navigator.clipboard.writeText(imageData.img_description)
        .then(() => {
          console.log('프롬프트가 클립보드에 복사되었습니다.');
        })
        .catch((err) => {
          console.error('복사 실패:', err);
        });
    }
  };

  return (
    <div className="image_viewer_overlay">
      <section className="img_viewer">
        {/* 모바일 버튼 */}
        <div className="mobile_button">
          <button className="mobile_copy_button" onClick={handleCopyPrompt}>Copy prompt</button>
          <button className="mobile_close_button" onClick={onClose}>close</button>
        </div>

        {/* 이미지 표시 영역 */}
        <div className="img_src" onClick={onClose}>
          <img src={imageData.img_src} alt={imageData.img_title || 'Image'} />
        </div>

        {/* 이미지 상세 정보 영역 */}
        <div className="prompt_wrap">
          <button className="copy_button" onClick={handleCopyPrompt}>Copy prompt</button>
          <div className="prompt_content">
            <span className="prompt_title">Prompt</span>
            <span className="prompt_description">{imageData.img_description || ''}</span>
          </div>
        </div>
      </section >
    </div >
  );
}

