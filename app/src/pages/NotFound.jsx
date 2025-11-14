// 404 Not Found 페이지 컴포넌트
import TransitionLink from '../components/TransitionLink.jsx';

export default function NotFound() {
  return (
    <>
      <div style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        height: '100vh',
        justifyContent: 'center'
      }}>
        <p style={{ fontSize: '1.2rem' }}>
          요청하신 페이지가 존재하지 않습니다.
        </p>
        <TransitionLink
          to="/"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#000',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
            transition: 'opacity 0.3s',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          홈으로 돌아가기
        </TransitionLink>
      </div>
    </>
  );
}
