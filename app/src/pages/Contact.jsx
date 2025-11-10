// Contact 페이지 컴포넌트
import { useState } from 'react';
import Footer from '../components/Footer';

export default function Contact() {
  // 이메일 주소 상태 (나중에 수동으로 추가 예정)
  const [email] = useState('achhrv@gmail.com');

  // 이메일 클립보드 복사 함수
  const handleEmailClick = async () => {
    if (email) {
      try {
        await navigator.clipboard.writeText(email);
        // 복사 성공 시 피드백 (선택사항)
        console.log('이메일이 클립보드에 복사되었습니다.');
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
          out, feel free to send me an <span className="accent" onClick={handleEmailClick}>email</span> or <span className="accent"><a href="https://www.instagram.com/chxwwws" target="_blank">direct message</a></span> anytime.
        </span>
      </section>
      {/* Footer 컴포넌트 추가 */}
      <Footer />
    </main>
  );
}

