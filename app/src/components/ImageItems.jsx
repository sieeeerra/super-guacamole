// items 배열을 props로 받아서 렌더링 (각 item {img_src, img_title, img_model, img_description})
// 이미지 클릭 시 onItemClick 콜백 호출
// Pinterest 스타일 Masonry 레이아웃 구현
import { useEffect, useRef, useState, useCallback } from 'react';

export default function ImageItems({ items, onItemClick }) {
  // 컨테이너와 아이템 요소 참조
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [loadedImages, setLoadedImages] = useState(0);

  // 이미지 클릭 핸들러
  const handleImageClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  // 이미지 로드 완료 핸들러
  const handleImageLoad = () => {
    setLoadedImages(prev => prev + 1);
  };

  // Masonry 레이아웃 계산 함수 (useCallback으로 최적화)
  const calculateMasonryLayout = useCallback(() => {
    if (!containerRef.current || items.length === 0) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const gap = 16; // gap
    const minColumnWidth = 250; // 최소 컬럼 너비 250px
    
    // 컬럼 수 계산
    const columnCount = Math.max(1, Math.floor((containerWidth + gap) / (minColumnWidth + gap)));
    const columnWidth = (containerWidth - (gap * (columnCount - 1))) / columnCount;

    // 각 컬럼의 높이를 추적하는 배열
    const columnHeights = new Array(columnCount).fill(0);

    // 각 아이템의 위치 계산
    itemRefs.current.forEach((itemRef, index) => {
      if (!itemRef) return;

      const imgElement = itemRef.querySelector('img');
      if (!imgElement || !imgElement.complete) return;

      // 이미지의 실제 높이 계산 (컬럼 너비에 맞춰 비율 조정)
      const naturalWidth = imgElement.naturalWidth;
      const naturalHeight = imgElement.naturalHeight;
      const aspectRatio = naturalHeight / naturalWidth;
      const itemHeight = columnWidth * aspectRatio;

      // 가장 짧은 컬럼 찾기
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

      // 아이템 위치 설정
      const left = shortestColumnIndex * (columnWidth + gap);
      const top = columnHeights[shortestColumnIndex];

      itemRef.style.width = `${columnWidth}px`;
      itemRef.style.left = `${left}px`;
      itemRef.style.top = `${top}px`;

      // 컬럼 높이 업데이트
      columnHeights[shortestColumnIndex] += itemHeight + gap;
    });

    // 컨테이너 높이 설정 (가장 긴 컬럼 높이)
    const maxHeight = Math.max(...columnHeights);
    container.style.height = `${maxHeight}px`;
  }, [items.length]);

  // 이미지 로드 완료 및 레이아웃 재계산
  useEffect(() => {
    if (loadedImages === items.length && items.length > 0) {
      // 모든 이미지가 로드된 후 약간의 지연을 두고 레이아웃 계산
      setTimeout(() => {
        calculateMasonryLayout();
      }, 100);
    }
  }, [loadedImages, items.length, calculateMasonryLayout]);

  // 리사이즈 이벤트 핸들링
  useEffect(() => {
    const handleResize = () => {
      if (loadedImages === items.length && items.length > 0) {
        calculateMasonryLayout();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loadedImages, items.length, calculateMasonryLayout]);

  // items 변경 시 loadedImages 리셋 및 refs 초기화
  useEffect(() => {
    setLoadedImages(0);
    itemRefs.current = [];
  }, [items]);

  return (
    <div className="image_items" ref={containerRef}>
      {items.map((item, index) => (
        <div 
          key={index} 
          className="item"
          ref={el => itemRefs.current[index] = el}
        >
          <div className="img" onClick={() => handleImageClick(item)}>
            <img 
              src={item.img_src} 
              alt={item.img_title || 'Image'}
              onLoad={handleImageLoad}
              onError={handleImageLoad} // 에러 발생 시에도 카운트 증가
            />
          </div>
          {/* <div className="img_title">
            <span>{item.img_title}</span>
          </div> */}
        </div>
      ))}
    </div>
  );
}

