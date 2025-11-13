// Footer 컴포넌트: 날짜/시간 동적 표시
import { useState, useEffect } from 'react';

export default function Footer({ updatedText = "Updated on November 13, 2025" }) {
  // 현재 날짜와 시간 상태 관리
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // 날짜와 시간을 동적으로 업데이트
  useEffect(() => {
    // 날짜 포맷 함수: "Month Day, Year" 형식
    const formatDate = (date) => {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    };

    // 시간 포맷 함수: "HH:MM:SS GMT+9" 형식
    const formatTime = (date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds} GMT+9`;
    };

    // 초기 설정 및 1초마다 업데이트
    const updateDateTime = () => {
      // GMT+9 타임존(한국 시간) 적용
      const now = new Date();
      // UTC 시간에 9시간을 더하여 GMT+9 계산
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
      const gmt9Time = new Date(utcTime + (9 * 60 * 60 * 1000));

      setCurrentDate(formatDate(gmt9Time));
      setCurrentTime(formatTime(gmt9Time));
    };

    // 즉시 실행
    updateDateTime();

    // 1초마다 업데이트
    const interval = setInterval(updateDateTime, 1000);

    // 클린업
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="footer">
      <div className="today">
        <span className="date">{currentDate}</span>
        <span className="time">{currentTime}</span>
      </div>
      <div className="text">

      </div>
      <div className="bottom">
        <div className="updated">{updatedText}</div>
        <div className="site_info">
          SITE NOTICE
          <div className="site_info_tooltip">
            <span>This website was created by CHWS.</span>
            <span>It is currently being updated, so some pages or features may change or not work as expected while you browse. Some pages contain temporary or placeholder content. Responsive layouts are currently being optimized.</span>
            <span>If you experience any display issues, please try refreshing your browser. Should the problem persist, feel free to reach out. Thank you for your understanding.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

