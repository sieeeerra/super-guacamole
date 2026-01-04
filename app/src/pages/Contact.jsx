// Contact 페이지 컴포넌트
import { useState, useEffect, useRef } from 'react';
import Footer from '../components/Footer';

export default function Contact() {
  const [email] = useState('email');
  // 복사 성공 상태 관리
  const [isCopied, setIsCopied] = useState(false);
  // 타이핑 애니메이션을 위한 텍스트 상태
  const [displayText, setDisplayText] = useState('send me');
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const textSpanRef = useRef(null);
  const [textWidth, setTextWidth] = useState(null);

  // 텍스트 변환 애니메이션 함수
  const typeText = (sourceText, targetText, onComplete) => {
    // 기존 interval 정리
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let currentIndex = 0;
    const maxLength = Math.max(sourceText.length, targetText.length);
    let currentText = sourceText;

    intervalRef.current = setInterval(() => {
      if (currentIndex < maxLength) {
        // 각 위치의 문자를 매핑하여 변환
        let newText = '';
        for (let i = 0; i < maxLength; i++) {
          if (i < currentIndex) {
            // 이미 변경된 위치는 목표 텍스트 사용
            newText += i < targetText.length ? targetText[i] : '';
          } else if (i === currentIndex) {
            // 현재 변경 중인 위치는 목표 텍스트로 변경
            newText += i < targetText.length ? targetText[i] : '';
          } else {
            // 아직 변경되지 않은 위치는 원본 텍스트 유지
            newText += i < sourceText.length ? sourceText[i] : '';
          }
        }
        setDisplayText(newText);
        currentIndex++;
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        // 최종 텍스트 설정
        setDisplayText(targetText);
        if (onComplete) {
          onComplete();
        }
      }
    }, 50); // 각 문자 타이핑 간격 (50ms)
  };

  // textWidth 계산 및 고정
  useEffect(() => {
    const calculateWidth = () => {
      // greeting_text 스타일을 직접 참조하여 계산
      const greetingText = document.querySelector('.greeting_text');
      if (greetingText) {
        const computedStyle = window.getComputedStyle(greetingText);
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'nowrap';
        tempSpan.style.fontSize = computedStyle.fontSize;
        tempSpan.style.fontWeight = computedStyle.fontWeight;
        tempSpan.style.letterSpacing = computedStyle.letterSpacing;
        tempSpan.style.textTransform = computedStyle.textTransform;
        tempSpan.style.fontFamily = computedStyle.fontFamily;
        tempSpan.textContent = 'send me';
        document.body.appendChild(tempSpan);
        const width = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        setTextWidth(width);
      }
    };

    // 컴포넌트 마운트 후 계산 (약간의 지연을 두어 DOM이 완전히 렌더링된 후 계산)
    const timer = setTimeout(calculateWidth, 100);
    // 윈도우 리사이즈 시 재계산
    window.addEventListener('resize', calculateWidth);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateWidth);
    };
  }, []);

  // 복사 상태 변경 시 타이핑 애니메이션 실행
  useEffect(() => {
    if (isCopied) {
      // 타이핑 변환 애니메이션
      typeText('send me', 'copied!', () => {
        // 2초 후 기존 텍스트로 변환
        timeoutRef.current = setTimeout(() => {
          typeText('copied!', 'send me', () => {
            setIsCopied(false);
          });
        }, 2000);
      });
    }

    // cleanup 함수
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCopied]);

  // 이메일 클립보드 복사 함수
  const handleEmailClick = async () => {
    if (email) {
      try {
        await navigator.clipboard.writeText(email);
        // 복사 성공 시 피드백: 타이핑 변환 애니메이션
        setIsCopied(true);
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
      }
    }
  };

  return (
    <main>
      <section className="greeting">
        <span className="greeting_text">
          Hello, I'm an energetic and culturally competent product designer based in Seoul. I like tackling
          challenging problems and have a knack for crafting intuitive user experiences. If you ever want to reach
          out, feel free to <span ref={textSpanRef} className={isCopied ? 'copied-text' : ''} style={{ display: 'inline-block', minWidth: textWidth ? `${textWidth}px` : 'auto', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{displayText}</span> an <span className="accent" onClick={handleEmailClick}>email</span> or <span className="accent"><a href="" target="_blank">direct message</a></span> anytime.
        </span>
      </section>
      {/* Footer 컴포넌트 추가 */}
      <Footer />
    </main>
  );
}

