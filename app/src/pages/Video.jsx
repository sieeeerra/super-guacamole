// Video 페이지 컴포넌트 - Header 컴포넌트 추가
import Header from '../components/Header.jsx';
import PageHead from '../components/PageHead.jsx';
import Footer from '../components/Footer.jsx';

export default function Video() {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: '#F9F9F9' }}>
        <section className="hero_vod">
          <video autoPlay muted loop className="vod">
            <source src="/vod/vod01.mp4" type="video/mp4" />
            브라우저가 video 태그를 지원하지 않습니다.
          </video>
          <div className="vod_caption">
            <span>scroll down</span>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 5V27" stroke="black" stroke-width="2" stroke-linejoin="bevel" />
              <path d="M7 18L16 27L25 18" stroke="black" stroke-width="2" stroke-linejoin="bevel" />
            </svg>
          </div>
        </section>
        <section>
          <PageHead
            mainTitle="Video"
            subTitle={
              <>
                All videos are produced based on storyboards and mood boards developed in
                advance. The storyboard defines the direction and visual style, and also includes a comprehensive
                plan for image production. The videos are created using AI-generated images and prompts.
                I primarily use popular generative AI tools to create images and explore
                their practical applications in design. I focus on understanding the value and potential of AI to
                deliver high-quality results efficiently, even with limited time and resources. Additionally, I
                document prompts and practical tips to optimize outcomes.<br /><br />All images in this document were produced by generative artificial intelligence and do not depict real photographs. Use of these images as design resources is permitted only within the scope of the applicable license terms, including restrictions on commercial use, redistribution, modification, or derivative works where specified.
              </>
            }
          />
        </section>
        <section>
          <div className="video_spacer" style={{ height: '20vw' }}></div>
        </section>
        {/* Footer 컴포넌트 추가 */}
        <Footer />
      </main>
    </>
  );
}

