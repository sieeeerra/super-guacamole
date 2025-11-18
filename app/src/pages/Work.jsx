// Work 페이지 컴포넌트
import { useState, useEffect } from 'react';
import Projects from '../components/Projects.jsx';
import Footer from '../components/Footer.jsx';
import PageHead from '../components/PageHead.jsx';
import { fetchProjects } from '../data/projectData.js';

export default function Work() {
  // Supabase에서 프로젝트 데이터를 가져오기 위한 상태 관리
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Supabase에서 프로젝트 데이터 로드
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // projectData.js의 fetchProjects 함수를 사용하여 데이터 조회
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        console.error('프로젝트 데이터 로드 실패:', err);
        setError(err.message || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <>
      <style>{`
      .work_page_head {
        min-height: 50vh;
      }
      
      /* 로딩 및 에러 상태 스타일 */
      .loading_container,
      .error_container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 50vh;
        padding: 40px;
      }
      
      .loading_text,
      .error_text {
        font-size: 18px;
        color: #666;
        text-align: center;
      }
      
      .error_text {
        color: #d32f2f;
      }
    `}</style>
      <main>
        <section className="work_page_head">
          <PageHead
            mainTitle="work"
            subTitle1={
              <>
                I prioritize solving problems by balancing usability with business objectives, rather than focusing solely on creating visually appealing screens. With a comprehensive understanding of product and development processes, I design solutions that harmonize practicality and creativity. These solutions transform ideas into meaningful, impactful user experiences.
              </>
            }
            subTitle2={
              <>
              </>
            }
          />
        </section>
        <section className="work">
          {/* 로딩 중일 때 로딩 UI 표시 */}
          {loading && (
            <div className="loading_container">
              <div className="loading_text">Loading...</div>
            </div>
          )}
          
          {/* 에러 발생 시 에러 메시지 UI 표시 */}
          {error && !loading && (
            <div className="error_container">
              <div className="error_text">
                Failed to load data.<br />
                {error}
              </div>
            </div>
          )}
          
          {/* 데이터 로드 성공 시 Projects 컴포넌트 렌더링 */}
          {!loading && !error && <Projects projects={projects} />}
        </section>
        {/* Footer 컴포넌트 */}
        <Footer />
      </main>
    </>
  );
}

