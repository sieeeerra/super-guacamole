// imageViewer modal component
import { useEffect, useRef, useState } from 'react';

export default function ImageViewer({ isOpen, imageData, onClose }) {
  // 이전 스크롤 위치를 저장하기 위한 ref
  const scrollPositionRef = useRef(0);
  // 프롬프트 복사 성공 상태 관리
  const [isCopied, setIsCopied] = useState(false);
  // mobile_button 표시 여부 관리
  const [showMobileButton, setShowMobileButton] = useState(true);

  // 모달 열림/닫힘에 따른 배경 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때: 현재 스크롤 위치 저장 및 배경 스크롤 막기
      scrollPositionRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      // 모달이 열릴 때 mobile_button 다시 표시
      setShowMobileButton(true);
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
    // EyeSlash인 경우 복사 막기
    if (imageData.img_description === 'EyeSlash') {
      return;
    }
    if (imageData.img_description) {
      navigator.clipboard.writeText(imageData.img_description)
        .then(() => {
          console.log('프롬프트가 클립보드에 복사되었습니다.');
          // 복사 성공 상태를 true로 설정
          setIsCopied(true);
          // 2초 후 자동으로 메시지 숨김
          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        })
        .catch((err) => {
          console.error('복사 실패:', err);
        });
    }
  };

  // mobile_button 탭 핸들러
  const handleButtonClick = (e) => {
    // 이벤트 전파를 막아 모달이 닫히지 않도록 함
    e.stopPropagation();
    // mobile_button만 즉시 사라지게 함
    setShowMobileButton(false);
  };

  return (
    <div className="image_viewer_overlay">
      {/* 복사 성공 메시지 */}
      {isCopied && (
        <div className="copy_success_message">copied!</div>
      )}
      <section className="img_viewer">

        {/* 이미지 표시 영역 */}
        <div className="img_src" onClick={onClose}>
          <img src={imageData.img_src} alt={imageData.img_title || 'Image'} />
          {/* 모바일 버튼 */}
          {showMobileButton && (
            <div 
              className="mobile_button"
              onClick={handleButtonClick}
            >
              <span>Tap anywhere to close</span>
            </div>
          )}
        </div>

        {/* 이미지 상세 정보 영역 */}
        <div className="prompt_wrap">
          <div className='button_wrap'>
            <button className="close_button" onClick={onClose}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 7L7 25" stroke="white" stroke-width="1.5" stroke-linejoin="bevel" />
                <path d="M25 25L7 7" stroke="white" stroke-width="1.5" stroke-linejoin="bevel" />
              </svg>
            </button>
            <button
              className="copy_button"
              onClick={handleCopyPrompt}
              disabled={imageData.img_description === 'EyeSlash'}
            >
              Copy prompt
            </button>
          </div>
          <div className="prompt_content">
            <span className="prompt_title">Prompt</span>
            {/* img_description이 'EyeSlash'인 경우 SVG 아이콘 표시, 그 외에는 텍스트 표시 */}
            {imageData.img_description === 'EyeSlash' ? (
              <span className="prompt_description">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="eye_slash_icon">
                  <path d="M32.5 13.75H7.5C6.80964 13.75 6.25 14.3096 6.25 15V32.5C6.25 33.1904 6.80964 33.75 7.5 33.75H32.5C33.1904 33.75 33.75 33.1904 33.75 32.5V15C33.75 14.3096 33.1904 13.75 32.5 13.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M13.75 13.75V8.75C13.75 7.0924 14.4085 5.50269 15.5806 4.33058C16.7527 3.15848 18.3424 2.5 20 2.5C21.6576 2.5 23.2473 3.15848 24.4194 4.33058C25.5915 5.50269 26.25 7.0924 26.25 8.75V13.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M20 20.75V24.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>

              </span>
            ) : (
              <span className="prompt_description">{imageData.img_description || ''}</span>
            )}
          </div>
        </div>
      </section >
    </div >
  );
}

