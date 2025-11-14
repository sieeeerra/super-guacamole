// 페이지 트랜지션을 관리하는 Context
// 트랜지션 시작 후 네비게이션을 지연시키기 위한 컨텍스트
import { createContext, useContext } from 'react';

const TransitionContext = createContext(null);

export const useTransition = () => {
    const context = useContext(TransitionContext);
    if (!context) {
        throw new Error('useTransition must be used within TransitionProvider');
    }
    return context;
};

export default TransitionContext;

