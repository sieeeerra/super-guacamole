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
  // 레이아웃 계산 중 플래그 (중복 계산 방지)
  const isCalculatingLayout = useRef(false);

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
    // 중복 계산 방지
    if (isCalculatingLayout.current) {
      return;
    }
    
    if (!containerRef.current || items.length === 0) {
      isCalculatingLayout.current = false;
      return;
    }

    // DOM이 준비되지 않았으면 재시도
    if (itemRefs.current.length !== items.length || itemRefs.current.length === 0) {
      setTimeout(() => {
        if (!isCalculatingLayout.current) {
          calculateMasonryLayout();
        }
      }, 100);
      return;
    }

    isCalculatingLayout.current = true;
    const container = containerRef.current;
    // 스크롤바 숨김 설정을 고려한 컨테이너 너비 계산
    // getBoundingClientRect().width는 스크롤바를 제외한 실제 사용 가능한 너비를 반환
    // 스크롤바가 숨겨져 있어도 정확한 너비를 계산할 수 있음
    const rect = container.getBoundingClientRect();
    let containerWidth = rect.width || container.clientWidth || container.offsetWidth;
    
    // 모바일에서 더 정확한 너비 계산 (스크롤바 숨김 고려)
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // 모바일에서는 여러 방법으로 너비 계산 시도
      // getBoundingClientRect()가 가장 정확 (스크롤바 제외)
      containerWidth = rect.width || container.clientWidth || container.offsetWidth || 0;
      // 부모 요소의 너비도 확인 (스크롤바 숨김 영향 최소화)
      if (containerWidth === 0 && container.parentElement) {
        const parentRect = container.parentElement.getBoundingClientRect();
        containerWidth = parentRect.width || 0;
      }
    }
    
    // 컨테이너 너비가 0이면 레이아웃 계산 중단 (모바일에서 여러 번 재시도)
    if (containerWidth === 0 || !containerWidth) {
      // 모바일에서 컨테이너 너비 계산이 지연될 수 있으므로 재시도 로직 개선
      let retryCount = 0;
      const maxRetries = isMobile ? 30 : 20; // 모바일에서 더 많은 재시도
      const retry = () => {
        if (retryCount < maxRetries && containerRef.current) {
          retryCount++;
          requestAnimationFrame(() => {
            // 재시도 시에도 스크롤바 숨김을 고려한 너비 계산
            const currentRect = containerRef.current?.getBoundingClientRect();
            const currentWidth = currentRect?.width || 
                                containerRef.current?.clientWidth || 
                                containerRef.current?.offsetWidth || 0;
            if (currentWidth > 0) {
              isCalculatingLayout.current = false;
              calculateMasonryLayout();
            } else {
              setTimeout(retry, isMobile ? 100 : 50);
            }
          });
        } else {
          // 최대 재시도 횟수 초과 시 플래그 리셋
          isCalculatingLayout.current = false;
        }
      };
      retry();
      return;
    }

    const gap = 16; // gap
    const minColumnWidth = 250; // 최소 컬럼 너비 250px

    // 컬럼 수 계산
    const columnCount = Math.max(1, Math.floor((containerWidth + gap) / (minColumnWidth + gap)));
    const columnWidth = (containerWidth - (gap * (columnCount - 1))) / columnCount;

    // 각 컬럼의 높이를 추적하는 배열
    const columnHeights = new Array(columnCount).fill(0);

    // 레이아웃 계산 전 모든 아이템을 숨김 (겹침 방지 및 스크롤바 방지)
    itemRefs.current.forEach((itemRef) => {
      if (itemRef) {
        itemRef.style.visibility = 'hidden';
        itemRef.style.position = 'absolute';
        itemRef.style.left = '0px';
        itemRef.style.top = '0px';
      }
    });

    // 각 아이템의 위치 계산
    let processedCount = 0;
    itemRefs.current.forEach((itemRef, index) => {
      if (!itemRef) return;

      const imgElement = itemRef.querySelector('img');
      if (!imgElement) return;

      // 이미지가 완전히 로드되었는지 확인 (complete 체크 및 naturalWidth/naturalHeight 검증)
      // 더 엄격한 검증 - undefined 및 isFinite 체크 추가
      const isImageLoaded = imgElement.complete && 
                           imgElement.naturalWidth > 0 && 
                           imgElement.naturalHeight > 0 &&
                           imgElement.naturalWidth !== undefined &&
                           imgElement.naturalHeight !== undefined &&
                           isFinite(imgElement.naturalWidth) &&
                           isFinite(imgElement.naturalHeight);
      
      if (!isImageLoaded) {
        // 이미지가 아직 로드 중이면 나중에 다시 계산하도록 스케줄링
        // 중복 리스너 추가 방지 (모바일뿐만 아니라 모든 경우에 추가)
        if (!imgElement.complete && !imgElement.hasAttribute('data-layout-listener')) {
          imgElement.setAttribute('data-layout-listener', 'true');
          const loadHandler = () => {
            // 이미지 로드 완료 후 약간의 지연을 두고 레이아웃 재계산
            setTimeout(() => {
              isCalculatingLayout.current = false;
              calculateMasonryLayout();
            }, 100);
          };
          imgElement.addEventListener('load', loadHandler, { once: true });
          // 에러 발생 시에도 처리
          imgElement.addEventListener('error', loadHandler, { once: true });
        }
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
      itemRef.style.position = 'absolute';
      itemRef.style.left = `${left}px`;
      itemRef.style.top = `${top}px`;
      itemRef.style.visibility = 'visible'; // 로드된 이미지만 표시

      // 컬럼 높이 업데이트
      columnHeights[shortestColumnIndex] += itemHeight + gap;
      processedCount++;
    });

    // 처리된 아이템이 있는 경우에만 컨테이너 높이 설정
    if (processedCount > 0) {
      const maxHeight = Math.max(...columnHeights);
      container.style.height = `${maxHeight}px`;
      // 스크롤바 방지를 위해 overflow 설정
      container.style.overflow = 'hidden';
      
      // 렌더 완료 후 강제로 레이아웃 재계산 (fitWidth 패턴)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 강제 리플로우 후 높이 재확인
          void container.offsetHeight;
          const recalculatedHeight = Math.max(...columnHeights);
          if (container.style.height !== `${recalculatedHeight}px`) {
            container.style.height = `${recalculatedHeight}px`;
          }
          isCalculatingLayout.current = false;
        });
      });
    } else {
      // processedCount가 0인 경우 (이미지가 로드되지 않음)
      // 최소 높이 설정으로 겹침 방지 및 스크롤바 방지
      container.style.minHeight = '200px';
      container.style.height = '200px';
      container.style.overflow = 'hidden';
      
      // 로드되지 않은 이미지가 있으면 재시도
      const hasUnloadedImages = itemRefs.current.some((itemRef) => {
        if (!itemRef) return false;
        const imgElement = itemRef.querySelector('img');
        return imgElement && (!imgElement.complete || 
               imgElement.naturalWidth === 0 || 
               imgElement.naturalHeight === 0);
      });
      
      if (hasUnloadedImages) {
        setTimeout(() => {
          isCalculatingLayout.current = false;
          calculateMasonryLayout();
        }, 500);
      } else {
        isCalculatingLayout.current = false;
      }
    }
  }, [items.length]);

  // 이미지 로드 완료 및 레이아웃 재계산 (간단하고 확실한 방식)
  useEffect(() => {
    if (items.length === 0) return;
    
    // 이미지가 하나라도 로드되면 레이아웃 계산 시도
    if (loadedImages > 0) {
      const timer = setTimeout(() => {
        if (!isCalculatingLayout.current && containerRef.current) {
          // 컨테이너 너비 확인
          const rect = containerRef.current.getBoundingClientRect();
          const containerWidth = rect.width || containerRef.current.clientWidth || containerRef.current.offsetWidth || 0;
          if (containerWidth > 0) {
            calculateMasonryLayout();
          } else {
            // 컨테이너 너비가 0이면 재시도
            setTimeout(() => {
              if (!isCalculatingLayout.current && containerRef.current) {
                calculateMasonryLayout();
              }
            }, 300);
          }
        }
      }, 300); // 페이지 전환 고려하여 지연 시간 증가
      return () => clearTimeout(timer);
    }
  }, [loadedImages, items.length, calculateMasonryLayout]);
  
  // 주기적으로 레이아웃 계산 시도 (폴백 메커니즘) - 매우 자주 체크
  useEffect(() => {
    if (items.length === 0) return;
    
    const intervalId = setInterval(() => {
      // 레이아웃이 계산되지 않았고, 이미지가 하나라도 있으면 시도
      if (!isCalculatingLayout.current && containerRef.current) {
        // 컨테이너 너비 확인
        const rect = containerRef.current.getBoundingClientRect();
        const containerWidth = rect.width || containerRef.current.clientWidth || containerRef.current.offsetWidth || 0;
        
        // 컨테이너 높이가 설정되지 않았거나 0이면 레이아웃이 계산되지 않은 것
        const containerHeight = containerRef.current.style.height;
        const needsLayout = !containerHeight || containerHeight === '0px' || containerHeight === '';
        
        if (containerWidth > 0 && itemRefs.current.length === items.length && itemRefs.current.length > 0) {
          const hasLoadedImages = itemRefs.current.some((itemRef) => {
            if (!itemRef) return false;
            const imgElement = itemRef.querySelector('img');
            return imgElement && imgElement.complete && 
                   imgElement.naturalWidth > 0 && 
                   imgElement.naturalHeight > 0;
          });
          
          if (hasLoadedImages && needsLayout) {
            calculateMasonryLayout();
          }
        }
      }
    }, 200); // 200ms마다 체크 (매우 자주)
    
    return () => clearInterval(intervalId);
  }, [items.length, calculateMasonryLayout]);

  // 리사이즈 이벤트 핸들링 (디바운싱 개선 - 모바일 최적화)
  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      // 모바일에서는 더 긴 디바운스 시간 사용
      const isMobile = window.innerWidth <= 768;
      const debounceTime = isMobile ? 300 : 150;
      
      resizeTimer = setTimeout(() => {
        // 컨테이너 너비가 유효한 경우에만 레이아웃 계산
        // 스크롤바 숨김을 고려한 너비 확인
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const containerWidth = rect.width || container.clientWidth || container.offsetWidth || 0;
          if (containerWidth > 0 && loadedImages > 0 && !isCalculatingLayout.current) {
            calculateMasonryLayout();
          }
        }
      }, debounceTime);
    };

    window.addEventListener('resize', handleResize);
    // 모바일에서 orientationchange 이벤트도 처리
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [loadedImages, items.length, calculateMasonryLayout]);

  // items 변경 추적을 위한 ref
  const prevItemsLengthRef = useRef(items.length);
  const prevItemsKeysRef = useRef(items.map(item => item.img_src).join(','));
  
  // items 변경 시 loadedImages 리셋 및 refs 초기화
  useEffect(() => {
    // items가 실제로 변경되었는지 확인 (길이와 img_src 비교)
    const currentKeys = items.map(item => item.img_src).join(',');
    const itemsChanged = prevItemsLengthRef.current !== items.length || 
                        prevItemsKeysRef.current !== currentKeys;
    
    if (itemsChanged) {
      isCalculatingLayout.current = false;
      setLoadedImages(0);
      loadedImageSet.current.clear();
      // 기존 아이템의 스타일 초기화 (페이지 전환 시 겹침 방지)
      itemRefs.current.forEach((itemRef) => {
        if (itemRef) {
          itemRef.style.left = '';
          itemRef.style.top = '';
          itemRef.style.width = '';
          itemRef.style.position = '';
          itemRef.style.visibility = '';
        }
      });
      // 컨테이너 높이 초기화 (스크롤바 방지)
      if (containerRef.current) {
        containerRef.current.style.height = '';
        containerRef.current.style.minHeight = '';
        containerRef.current.style.overflow = '';
      }
      itemRefs.current = [];
      prevItemsLengthRef.current = items.length;
      prevItemsKeysRef.current = currentKeys;
    }
  }, [items]);
  
  // items 변경 후 강제로 레이아웃 계산 시도 (페이지 전환 대응) - 매우 적극적인 방식
  useEffect(() => {
    if (items.length === 0) return;
    
    // items가 실제로 변경되었는지 확인
    const currentKeys = items.map(item => item.img_src).join(',');
    const itemsChanged = prevItemsLengthRef.current !== items.length || 
                        prevItemsKeysRef.current !== currentKeys;
    
    // 초기 마운트 시에는 무조건 실행
    if (!itemsChanged && prevItemsLengthRef.current > 0) {
      return; // items가 변경되지 않았으면 무시
    }
    
    const timers = [];
    let attemptCount = 0;
    const maxAttempts = 50; // 최대 50번 시도 (매우 많이)
    
    // 여러 단계로 레이아웃 계산 시도
    const attemptLayout = () => {
      attemptCount++;
      
      if (!containerRef.current) {
        if (attemptCount < maxAttempts) {
          timers.push(setTimeout(attemptLayout, 100));
        }
        return;
      }
      
      // 컨테이너 너비 확인
      const rect = containerRef.current.getBoundingClientRect();
      const containerWidth = rect.width || containerRef.current.clientWidth || containerRef.current.offsetWidth || 0;
      
      if (containerWidth === 0) {
        if (attemptCount < maxAttempts) {
          timers.push(setTimeout(attemptLayout, 100));
        }
        return;
      }
      
      // DOM이 준비되었는지 확인
      if (itemRefs.current.length !== items.length || itemRefs.current.length === 0) {
        if (attemptCount < maxAttempts) {
          timers.push(setTimeout(attemptLayout, 100));
        }
        return;
      }
      
      // 로드된 이미지가 있는지 확인 (하나만 있어도 시도)
      const hasLoadedImages = itemRefs.current.some((itemRef) => {
        if (!itemRef) return false;
        const imgElement = itemRef.querySelector('img');
        return imgElement && imgElement.complete && 
               imgElement.naturalWidth > 0 && 
               imgElement.naturalHeight > 0;
      });
      
      if (hasLoadedImages && !isCalculatingLayout.current) {
        calculateMasonryLayout();
      } else if (attemptCount < maxAttempts) {
        // 이미지가 아직 로드되지 않았으면 계속 시도
        timers.push(setTimeout(attemptLayout, 150));
      }
    };
    
    // 즉시 시작
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        attemptLayout();
      });
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [items, calculateMasonryLayout]);

  // 마운트 후 및 items 변경 시 이미지 로드 상태 확인 (캐시된 이미지 처리, 페이지 전환 고려)
  useEffect(() => {
    if (items.length === 0) return;

    // 모든 이미지 요소가 이미 로드되었는지 확인
    let retryCount = 0;
    const maxRetries = 20; // 최대 재시도 횟수 증가
    const checkLoadedImages = () => {
      // DOM이 완전히 렌더링되었는지 확인
      if (itemRefs.current.length === 0 || itemRefs.current.length !== items.length) {
        // DOM이 아직 준비되지 않았으면 재시도 (최대 횟수 제한)
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(checkLoadedImages, 100);
        }
        return;
      }

      let alreadyLoadedCount = 0;
      itemRefs.current.forEach((itemRef, index) => {
        if (!itemRef) return;
        const imgElement = itemRef.querySelector('img');
        // 더 엄격한 검증 - undefined 및 isFinite 체크 추가
        if (imgElement && imgElement.complete && 
            imgElement.naturalWidth > 0 && 
            imgElement.naturalHeight > 0 &&
            imgElement.naturalWidth !== undefined &&
            imgElement.naturalHeight !== undefined &&
            isFinite(imgElement.naturalWidth) &&
            isFinite(imgElement.naturalHeight)) {
          if (!loadedImageSet.current.has(index)) {
            loadedImageSet.current.add(index);
            alreadyLoadedCount++;
          }
        }
      });
      
      if (alreadyLoadedCount > 0) {
        setLoadedImages(prev => prev + alreadyLoadedCount);
      } else if (itemRefs.current.length > 0 && retryCount < maxRetries) {
        // 이미지가 아직 로드되지 않았지만 DOM은 준비된 경우 재시도
        // 페이지 전환 애니메이션 완료를 고려하여 더 긴 대기 시간
        retryCount++;
        setTimeout(checkLoadedImages, 200);
      }
    };

    // 페이지 전환 애니메이션 완료를 고려하여 더 긴 대기 시간
    // DOM이 업데이트되고 페이지 전환이 완료된 후 확인
    const timer = setTimeout(checkLoadedImages, 200);
    return () => clearTimeout(timer);
  }, [items]);

  return (
    <div 
      className="image_items" 
      ref={containerRef}
      style={{
        overflow: 'hidden', // 스크롤바 방지
        minHeight: items.length > 0 ? '200px' : '0px' // 초기 최소 높이 설정
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="item"
          ref={el => itemRefs.current[index] = el}
          style={{
            visibility: 'hidden', // 레이아웃 계산 전까지 숨김 (스크롤바 방지)
            position: 'absolute' // 초기 위치 설정
          }}
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

