// 404 Not Found 페이지 컴포넌트
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import PageHead from '../components/PageHead.jsx';

export default function NotFound() {
  return (
    <main>
      <section>
        <PageHead 
          mainTitle="404"
          subTitle="페이지를 찾을 수 없습니다."
        />
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            요청하신 페이지가 존재하지 않습니다.
          </p>
          <Link 
            to="/" 
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#000',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '4px',
              transition: 'opacity 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            홈으로 돌아가기
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}

