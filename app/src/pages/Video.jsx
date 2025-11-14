// Video 페이지 컴포넌트
import { useState, useEffect } from 'react';
import PageHead from '../components/PageHead.jsx';
import Footer from '../components/Footer.jsx';
import { supabase } from '../lib/supabase.js';

export default function Video() {
  // 비디오 URL, 로딩 상태, 에러 상태 관리
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 비디오 URL 가져오기
  useEffect(() => {
    async function loadVideoUrl() {
      try {
        setIsLoading(true);
        setError(null);
        
        // video_url 가져오기
        const { data, error: supabaseError } = await supabase
          .from('videoData')
          .select('video_url')
          .limit(1)
          .single();
        
        if (supabaseError) {
          console.error('비디오 URL 조회 오류:', supabaseError);
          // NOT_FOUND 에러인 경우 더 명확한 메시지 제공
          if (supabaseError.code === 'PGRST116' || supabaseError.message?.includes('NOT_FOUND') || supabaseError.message?.includes('404')) {
            throw new Error('videoData 테이블을 찾을 수 없습니다. Supabase 데이터베이스 설정을 확인하세요.');
          }
          throw supabaseError;
        }
        
        if (data && data.video_url) {
          setVideoUrl(data.video_url);
        } else {
          setError('비디오 URL을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('비디오 URL 로딩 실패:', err);
        let errorMessage = '비디오 URL을 불러오는데 실패했습니다.';
        if (err?.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadVideoUrl();
  }, []);

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <main>
        <section className="hero_vod">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <span>Loading...</span>
          </div>
        </section>
      </main>
    );
  }

  // 에러 발생 시 표시
  if (error) {
    return (
      <main>
        <section>
          <PageHead mainTitle={error} />
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <>
      <main>
        <section className="hero_vod">
          <video autoPlay muted loop className="vod">
            {videoUrl && <source src={videoUrl} type="video/mp4" />}
            브라우저가 video 태그를 지원하지 않습니다.
          </video>
          <div className="vod_caption">
            <span>Scroll down</span>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="7" y="2" width="18" height="28" rx="9" stroke="white" strokeWidth="2" />
              <path d="M16 10L16 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </section>
        <section style={{ minHeight: '100vh' }}>
          <PageHead
            mainTitle="Video"
            subTitle1={
              <>
                All videos are produced based on storyboards and mood boards developed in
                advance. The storyboard defines the direction and visual style, and also includes a comprehensive
                plan for image production. The videos are created using AI-generated images and prompts.
              </>
            }
            subTitle2={
              <>
                Videos in this document were produced by generative artificial intelligence and do not depict real.
                Use of these videos as design resources is permitted only within the scope of the applicable license terms,
                including restrictions on commercial use, redistribution, modification, or derivative works where specified.
              </>
            }
          />
        </section>
        {/* Footer 컴포넌트 추가 */}
        <Footer />
      </main>
    </>
  );
}

