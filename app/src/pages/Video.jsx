// Video 페이지 컴포넌트
import PageHead from '../components/PageHead.jsx';
import Footer from '../components/Footer.jsx';

export default function Video() {
  return (
    <>
      <main>
        <section className="hero_vod">
          <video autoPlay muted loop className="vod">
            <source src="https://gm-prd-resource.gentlemonster.com/main/banner/770800970997325499/acc3f823-6a91-4897-b629-3891b5632fe9/main_0_pc_1920*990.mp4" type="video/mp4" />
            브라우저가 video 태그를 지원하지 않습니다.
          </video>
          <div className="vod_caption">
            <span>Scroll down</span>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="7" y="2" width="18" height="28" rx="9" stroke="white" stroke-width="2" />
              <path d="M16 10L16 16" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>




          </div>
        </section>
        <section style={{ minHeight: '120vh' }}>
          <PageHead
            mainTitle="Video"
            subTitle={
              <>
                All videos are produced based on storyboards and mood boards developed in
                advance. The storyboard defines the direction and visual style, and also includes a comprehensive
                plan for image production. The videos are created using AI-generated images and prompts.
                <br /><br />
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

