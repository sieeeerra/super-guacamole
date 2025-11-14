// Work 페이지 컴포넌트
import Projects from '../components/Projects.jsx';
import Footer from '../components/Footer.jsx';
import PageHead from '../components/PageHead.jsx';
import { projects } from '../data/projectData.js';

export default function Work() {
  return (
    <>
      <style>{`
      .work_page_head {
        min-height: 50vh;
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
          <Projects projects={projects} />
        </section>
        {/* Footer 컴포넌트 */}
        <Footer />
      </main>
    </>
  );
}

