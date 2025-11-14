// items 배열을 props로 받아서 렌더링 (각 item {img_src, img_title, img_model, img_description})
// 이미지 클릭 시 onItemClick 콜백 호출
// Pinterest 스타일 Masonry 레이아웃 구현
import { useEffect, useRef, useState, useCallback } from 'react';

export default function ImageItems({ items, onItemClick }) {
  // 컨테이너와 아이템 요소 참조
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [loadedImages, setLoadedImages] = useState(0);
  // 이미지 로드 상태를 추적하는 Set 추가 (중복 카운트 방지)
  const loadedImageSet = useRef(new Set());

  // 이미지 클릭 핸들러
  const handleImageClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  // 이미지 로드 완료 핸들러 (중복 카운트 방지)
  const handleImageLoad = useCallback((index) => {
    if (!loadedImageSet.current.has(index)) {
      loadedImageSet.current.add(index);
      setLoadedImages(prev => prev + 1);
    }
  }, []);

  // Masonry 레이아웃 계산 함수 (useCallback으로 최적화)
  const calculateMasonryLayout = useCallback(() => {
    if (!containerRef.current || items.length === 0) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    
    // 컨테이너 너비가 0이면 레이아웃 계산 중단 (다음 프레임에 재시도)
    if (containerWidth === 0) {
      requestAnimationFrame(() => {
        calculateMasonryLayout();
      });
      return;
    }

    const gap = 16; // gap
    const minColumnWidth = 250; // 최소 컬럼 너비 250px

    // 컬럼 수 계산
    const columnCount = Math.max(1, Math.floor((containerWidth + gap) / (minColumnWidth + gap)));
    const columnWidth = (containerWidth - (gap * (columnCount - 1))) / columnCount;

    // 각 컬럼의 높이를 추적하는 배열
    const columnHeights = new Array(columnCount).fill(0);

    // 각 아이템의 위치 계산
    let processedCount = 0;
    itemRefs.current.forEach((itemRef, index) => {
      if (!itemRef) return;

      const imgElement = itemRef.querySelector('img');
      if (!imgElement) return;

      // 이미지가 완전히 로드되었는지 확인 (complete 체크 및 naturalWidth/naturalHeight 검증)
      if (!imgElement.complete || imgElement.naturalWidth === 0 || imgElement.naturalHeight === 0) {
        return;
      }

      // 이미지의 실제 높이 계산 (컬럼 너비에 맞춰 비율 조정)
      const naturalWidth = imgElement.naturalWidth;
      const naturalHeight = imgElement.naturalHeight;
      const aspectRatio = naturalHeight / naturalWidth;
      const itemHeight = columnWidth * aspectRatio;

      // 유효하지 않은 높이 체크
      if (!isFinite(itemHeight) || itemHeight <= 0) {
        return;
      }

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
      processedCount++;
    });

    // 처리된 아이템이 있는 경우에만 컨테이너 높이 설정
    if (processedCount > 0) {
      const maxHeight = Math.max(...columnHeights);
      container.style.height = `${maxHeight}px`;
    }
  }, [items.length]);

  // 이미지 로드 완료 및 레이아웃 재계산
  useEffect(() => {
    if (loadedImages === items.length && items.length > 0) {
      // 모든 이미지가 로드된 후 약간의 지연을 두고 레이아웃 계산
      // requestAnimationFrame을 사용하여 DOM 업데이트 후 실행 보장
      requestAnimationFrame(() => {
        setTimeout(() => {
          calculateMasonryLayout();
        }, 100);
      });
    }
  }, [loadedImages, items.length, calculateMasonryLayout]);

  // 리사이즈 이벤트 핸들링 (디바운싱 추가)
  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (loadedImages === items.length && items.length > 0) {
          calculateMasonryLayout();
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [loadedImages, items.length, calculateMasonryLayout]);

  // items 변경 시 loadedImages 리셋 및 refs 초기화
  useEffect(() => {
    setLoadedImages(0);
    loadedImageSet.current.clear();
    itemRefs.current = [];
  }, [items]);

  // 마운트 후 및 items 변경 시 이미지 로드 상태 확인 (캐시된 이미지 처리)
  useEffect(() => {
    if (items.length === 0) return;

    // 모든 이미지 요소가 이미 로드되었는지 확인
    const checkLoadedImages = () => {
      let alreadyLoadedCount = 0;
      itemRefs.current.forEach((itemRef, index) => {
        if (!itemRef) return;
        const imgElement = itemRef.querySelector('img');
        if (imgElement && imgElement.complete && 
            imgElement.naturalWidth > 0 && imgElement.naturalHeight > 0) {
          if (!loadedImageSet.current.has(index)) {
            loadedImageSet.current.add(index);
            alreadyLoadedCount++;
          }
        }
      });
      
      if (alreadyLoadedCount > 0) {
        setLoadedImages(prev => prev + alreadyLoadedCount);
      }
    };

    // DOM이 업데이트된 후 확인
    const timer = setTimeout(checkLoadedImages, 50);
    return () => clearTimeout(timer);
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
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageLoad(index)} // 에러 발생 시에도 카운트 증가
            />
          </div>
          <span className="img_title">{item.img_title}</span>
        </div>
      ))}
    </div>
  );
}

