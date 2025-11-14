// 페이지 전환 시 SVG overlay 트랜지션 애니메이션 컴포넌트
// 트랜지션이 먼저 시작되고, 화면이 덮인 후 페이지 전환
import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import TransitionContext from '../contexts/TransitionContext.jsx';

// SVG path 애니메이션 경로 정의
const paths = {
    step1: {
        unfilled: 'M 0 100 V 100 Q 50 100 100 100 V 100 z',
        inBetween: {
            curve1: 'M 0 100 V 50 Q 50 0 100 50 V 100 z',
            curve2: 'M 0 100 V 50 Q 50 100 100 50 V 100 z'
        },
        filled: 'M 0 100 V 0 Q 50 0 100 0 V 100 z',
    },
    step2: {
        filled: 'M 0 0 V 100 Q 50 100 100 100 V 0 z',
        inBetween: {
            curve1: 'M 0 0 V 50 Q 50 0 100 50 V 0 z',
            curve2: 'M 0 0 V 50 Q 50 100 100 50 V 0 z'
        },
        unfilled: 'M 0 0 V 0 Q 50 0 100 0 V 0 z',
    }
};

export default function PageTransition({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const overlayPathRef = useRef(null);
    const isAnimatingRef = useRef(false);
    const pendingNavigationRef = useRef(null);

    // 페이지 전환 애니메이션 (reveal) - 네비게이션 콜백 포함
    const reveal = useCallback((onFilled, delayTime = 1) => {
        if (isAnimatingRef.current || !overlayPathRef.current) return;
        isAnimatingRef.current = true;

        gsap.timeline({
            onComplete: () => {
                isAnimatingRef.current = false;
            }
        })
        .set(overlayPathRef.current, {
            attr: { d: paths.step2.unfilled },  // 위에서 시작 (보이지 않음)
            immediateRender: true
        })
        .to(overlayPathRef.current, { 
            duration: 0.8,  // 첫 번째 단계: 화면이 위에서 아래로 내려오기 시작
            ease: 'power4.in',
            attr: { d: paths.step2.inBetween.curve2 }
        }, 0)
        .to(overlayPathRef.current, { 
            duration: 0.2,  // 두 번째 단계: 화면이 완전히 덮임 - 페이지 전환
            ease: 'power1',
            attr: { d: paths.step2.filled },
            onComplete: () => {
                // 화면이 완전히 덮인 후 네비게이션 실행
                if (onFilled) {
                    onFilled();
                }
            }
        })
        .to(overlayPathRef.current, { 
            duration: 0.2,  // 세 번째 단계: 위로 사라지기 시작
            ease: 'sine.in',
            attr: { d: paths.step2.inBetween.curve1 }, // 위로 사라지기 시작 (가운데가 먼저)
            delay: delayTime  // 완전히 덮혀있는 지속시간 (파라미터로 조정 가능)
        })
        .to(overlayPathRef.current, { 
            duration: 1,  // 마지막 단계: 화면이 위로 완전히 사라짐
            ease: 'power4',
            attr: { d: paths.step2.unfilled }
        });
    }, []);

    // 이전 페이지로 돌아가는 애니메이션 (unreveal) - 네비게이션 콜백 포함
    // reveal과 동일한 애니메이션 사용 (위에서 아래로 내려오고 위로 사라짐)
    const unreveal = useCallback((onFilled, delayTime = 1) => {
        if (isAnimatingRef.current || !overlayPathRef.current) return;
        isAnimatingRef.current = true;

        gsap.timeline({
            onComplete: () => {
                isAnimatingRef.current = false;
            }
        })
        .set(overlayPathRef.current, {
            attr: { d: paths.step2.unfilled },  // 위에서 시작 (보이지 않음)
            immediateRender: true
        })
        .to(overlayPathRef.current, { 
            duration: 0.8,  // 첫 번째 단계: 화면이 위에서 아래로 내려오기 시작
            ease: 'power4.in',
            attr: { d: paths.step2.inBetween.curve2 }
        }, 0)
        .to(overlayPathRef.current, { 
            duration: 0.2,  // 두 번째 단계: 화면이 완전히 덮임 - 페이지 전환
            ease: 'power1',
            attr: { d: paths.step2.filled },
            onComplete: () => {
                // 화면이 완전히 덮인 후 네비게이션 실행
                if (onFilled) {
                    onFilled();
                }
            }
        })
        .to(overlayPathRef.current, { 
            duration: 0.2,  // 세 번째 단계: 위로 사라지기 시작
            ease: 'sine.in',
            attr: { d: paths.step2.inBetween.curve1 },
            delay: delayTime  // 완전히 덮혀있는 지속시간 (파라미터로 조정 가능)
        })
        .to(overlayPathRef.current, { 
            duration: 1,  // 마지막 단계: 화면이 위로 완전히 사라짐
            ease: 'power4',
            attr: { d: paths.step2.unfilled }
        });
    }, []);

    // 트랜지션 시작 함수 - 외부에서 호출 가능
    const startTransition = useCallback((to, from) => {
        if (isAnimatingRef.current) return;

        // 네비게이션을 지연시키고 트랜지션 먼저 시작
        pendingNavigationRef.current = to;
        
        // 현재 경로에 따라 reveal 또는 unreveal 선택
        const isToHome = to === '/';
        const isFromHome = from === '/';
        const isToImage = to === '/image';
        const isFromImage = from === '/image';
        
        // 이미지 페이지로 이동하거나 이미지 페이지에서 이동할 때는 다른 delay 사용
        const delayTime = (isToImage || isFromImage) ? 1.7 : 0.6;  // 이미지 페이지 : 그 외 페이지
        
        if (isFromHome && !isToHome) {
            // 홈에서 다른 페이지로 이동
            reveal(() => {
                navigate(to);
            }, delayTime);
        } else if (!isFromHome && isToHome) {
            // 다른 페이지에서 홈으로 이동
            unreveal(() => {
                navigate(to);
            }, delayTime);
        } else {
            // 다른 페이지 간 이동
            reveal(() => {
                navigate(to);
            }, delayTime);
        }
    }, [navigate, reveal, unreveal]);

    // location 변경 감지 - 자동 트랜지션은 비활성화 (수동 트랜지션만 사용)
    useEffect(() => {
        // pendingNavigation이 있으면 이미 트랜지션 중이므로 무시
        if (pendingNavigationRef.current === location.pathname) {
            pendingNavigationRef.current = null;
            return;
        }
    }, [location.pathname]);

    return (
        <TransitionContext.Provider value={{ startTransition }}>
            {children}
            <svg 
                className="overlay" 
                width="100%" 
                height="100%" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
            >
                <path 
                    ref={overlayPathRef}
                    className="overlay__path" 
                    vectorEffect="non-scaling-stroke" 
                    d="M 0 100 V 100 Q 50 100 100 100 V 100 z" 
                />
            </svg>
        </TransitionContext.Provider>
    );
}

