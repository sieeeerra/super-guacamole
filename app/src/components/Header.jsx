// 헤더 컴포넌트
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <div className="logo">
        <Link to="/">
          <img src="/img/logo.svg" alt="Logo" />
        </Link>
      </div>
      <nav>
        <ul className="menu">
          <li><a href="">Works</a></li>
        </ul>
        <ul className="menu">
          <li><Link to="/image">Image,</Link></li>
          <li><a href="">Video</a></li>
        </ul>
        <ul className="menu">
          <li><a href="">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}
