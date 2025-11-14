// 커스텀 Link 컴포넌트 - 트랜지션을 먼저 시작하고 페이지 전환
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTransition } from '../contexts/TransitionContext.jsx';

export default function TransitionLink({ to, children, ...props }) {
    const location = useLocation();
    const { startTransition } = useTransition();
    const linkRef = useRef(null);

    const handleClick = (e) => {
        e.preventDefault();
        
        // 현재 경로와 동일하면 트랜지션 실행하지 않음
        if (location.pathname === to) {
            return;
        }

        // 트랜지션 시작 (화면이 덮인 후 네비게이션 실행)
        startTransition(to, location.pathname);
    };

    return (
        <a 
            ref={linkRef}
            href={to} 
            onClick={handleClick}
            {...props}
        >
            {children}
        </a>
    );
}

