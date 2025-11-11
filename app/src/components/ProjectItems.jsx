// projects 배열을 props로 받아서 렌더링 (각 project {main_title, sub_title, year, link})
export default function ProjectItems({ projects }) {
  return (
    <>
      {/* global.scss의 project_items 스타일을 컴포넌트 내부로 이동 */}
      <style>{`
        .project_items {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 100vh;
        }

        .project_items .project {
          padding: 16px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 16px;
          border-radius: 12px;
          width: 100%;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: -0.01em;
          line-height: 1;
          transition: .3s cubic-bezier(.2, .8, .2, 1);
        }

        .project_items .project:hover {
          background-color: #f3f3f3;
        }

        .project_items .project .project_title {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 6px;
        }

        .project_items .project .project_title .main_title {
          color: #171717;
          text-transform: capitalize;
        }

        .project_items .project .project_title .sub_title {
          color: #6f6f6f;
        }

        .project_items .project .line {
          flex: 1;
          height: 1px;
          background-color: #e4e4e4;
        }

        .project_items .project .date {
          color: #8f8f8f;
        }
      `}</style>
      <div className="project_items">
        {projects.map((project, index) => (
          <a 
            key={index} 
            href={project.link || '#'} 
            target={project.link ? "_blank" : undefined}
            rel={project.link ? "noopener noreferrer" : undefined}
            className="project"
          >
            <div className="project_title">
              <span className="main_title">{project.main_title}</span>
              <span className="sub_title">{project.sub_title}</span>
            </div>
            <div className="line"></div>
            <span className="date">{project.date}</span>
          </a>
        ))}
      </div>
    </>
  );
}

