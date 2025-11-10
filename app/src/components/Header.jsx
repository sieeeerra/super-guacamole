// 헤더 컴포넌트
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <div className="logo">
        <Link to="/">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_176_225)">
              <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12Z" fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_176_225">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </Link>
      </div>
      <nav>
        <ul className="menu">
          <li><a href="">Work</a></li>
        </ul>
        <ul className="menu">
          <li><Link to="/image">Image,</Link></li>
          <li><Link to="/video">Video</Link></li>
        </ul>
        <ul className="menu">
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}
