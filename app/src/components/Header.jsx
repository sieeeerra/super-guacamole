// 헤더 컴포넌트
// 트랜지션을 사용하는 커스텀 Link 컴포넌트 사용
// 현재 페이지 감지를 위해 useLocation 추가
import { useLocation } from 'react-router-dom';
import TransitionLink from './TransitionLink.jsx';

export default function Header() {
  // 현재 경로 가져오기
  const location = useLocation();

  return (
    <header>
      <div className="logo">
        <TransitionLink to="/">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_176_225)">
              <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12Z" fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_176_225">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </TransitionLink>
      </div>
      <nav>
        <ul className="menu">
          <li className={location.pathname === '/work' ? 'active' : ''}><TransitionLink to="/work">Work</TransitionLink></li>
        </ul>
        <ul className="menu">
          <li className={location.pathname === '/image' ? 'active' : ''}><TransitionLink to="/image">Image,</TransitionLink></li>
          <li className={location.pathname === '/video' ? 'active' : ''}><TransitionLink to="/video">Video</TransitionLink></li>
        </ul>
        <ul className="menu">
          <li className={location.pathname === '/contact' ? 'active' : ''}><TransitionLink to="/contact">Contact</TransitionLink></li>
        </ul>
      </nav>
    </header>
  );
}
