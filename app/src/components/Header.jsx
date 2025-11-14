// 헤더 컴포넌트
// 트랜지션을 사용하는 커스텀 Link 컴포넌트 사용
import TransitionLink from './TransitionLink.jsx';

export default function Header() {
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
          <li><TransitionLink to="/work">Work</TransitionLink></li>
        </ul>
        <ul className="menu">
          <li><TransitionLink to="/image">Image,</TransitionLink></li>
          <li><TransitionLink to="/video">Video</TransitionLink></li>
        </ul>
        <ul className="menu">
          <li><TransitionLink to="/contact">Contact</TransitionLink></li>
        </ul>
      </nav>
    </header>
  );
}
