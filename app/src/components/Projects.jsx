// props 기반 동적 렌더링 구현: projectData.js의 projects 배열을 props로 받아서 렌더링
export default function Projects({ projects }) {
  // 프로젝트 아이템 hover 시 해당 이미지를 보이게 하는 CSS 동적 생성
  const generateImageHoverStyles = () => {
    return projects.map((_, index) => {
      const itemIndex = index + 1;
      return `.project:has(.project_items .project_item:nth-child(${itemIndex}):hover) .project_imgs .project_img:nth-child(${itemIndex}) {
          opacity: 1;
          visibility: visible;
        }`;
    }).join('\n        ');
  };

  // CSS 스타일 문자열 생성
  const hoverStyles = generateImageHoverStyles();

  return (
    <>
      <style>{`
        .section_title {
          display: block;
          font-size: 48px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
      
        .project {
          display: flex;
          justify-content: start;
          gap: 24px;
          width: 100%;
          height: 80vh;
          position: relative;
          margin-bottom: 25vh;
        }

        .project_imgs {
          flex: 1;
          height: 100%;
          background-color: #f8f8f8;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }

        .project_img_caption {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .project_img_caption img {
          display: block;
          width: 40px;
          height: auto;
          transform: rotate(90deg);
        }

        .project_img {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          visibility: hidden;
          transition: 0.3s ease;
          padding: 30px;
          z-index: 1;
        }

        .project_img img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
        }

        .project_img:nth-child(4) img {
          transform: scale(0.33);
        }

        .project_items {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 40px;
          margin-top: 10px;
          margin-bottom: 10px;
        }

        .project_item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
          padding-bottom: 10px;
          position: relative;
          border-bottom: 1px solid #eee;
          transition: 0.3s ease-in-out;
        }

        .item_txt {
          font-size: 24px;
          font-weight: 500;
          letter-spacing: -0.05em;
          text-transform: capitalize;
          transition: 0.3s ease-in-out;
          position: relative;
        }

        .item_txt::after {
          position: absolute;
          content: '';
          top: 50%;
          left: -0.7em;
          width: 1.5em;
          height: 0.3em;
          border-radius: 100em;
          background: #333;
          opacity: 0;
          transition: all 0.525s cubic-bezier(0.625, 0.05, 0, 1);
          transform: translate(-60%, -50%) scale(0);
        }

        .item_icon {
          opacity: 0;
          visibility: hidden;
          transition: 0.3s ease-in-out;
          display: inline-block;
          width: fit-content;
          height: fit-content;
        }

        .item_icon img {
          display: block;
        }

        .project_item:hover .item_txt {
          margin-left: 0.7em;
        }

        .project_item:hover .item_txt::after {
          transform: translate(0, -50%) scale(1);
          opacity: 1;
          width: 0.3em;
        }

        .project_item:hover .item_icon {
          margin-right: 0.3em;
          opacity: 1;
          visibility: visible;
        }

        /* 프로젝트 아이템 hover 시 해당 이미지 표시 - 동적 생성 */
        ${hoverStyles}

        /* mobile size */
        @media (max-width: 768px) {
          .section_title {
            font-size: 32px;
            margin-bottom: 12px;
          }

          .project {
            height: auto;
            margin-top: 0px;
          }

          .project .project_imgs {
            display: none;
          }

          .project .project_items {
            gap: 20px;
          }

          .project .project_items .project_item {
            padding-bottom: 10px;
          }

          .project .project_items .project_item .item_txt {
            font-size: 20px;
            font-weight: 500;
          }

          .project .project_items .project_item .item_icon {
            opacity: 1;
            visibility: visible;
            display: inline-block;
            width: fit-content;
            height: fit-content;
          }

          .project .project_items .project_item .item_icon img {
            width: 32px;
            height: 32px;
            display: block;
          }
        }
      `}</style>
      <span className="section_title">selected works</span>
      <div className="project">
        <div className="project_imgs">
          {projects.map((project, index) => (
            <div key={index} className="project_img">
              <img src={project.img} alt="Image" />
            </div>
          ))}
          <div className="project_img_caption"><img src="/icon/pointer.svg" alt="Pointer" /></div>
        </div>
        <div className="project_items">
          {projects.map((project, index) => {
            const ItemWrapper = project.link ? 'a' : 'div';
            const iconSrc = project.link 
              ? '/icon/arrow_upright.svg' 
              : '/icon/lock.svg';
            const iconAlt = project.link 
              ? 'Arrow Up Right' 
              : 'Lock';
            
            return (
              <ItemWrapper
                key={index}
                {...(project.link && { href: project.link, target: '_blank' })}
                className="project_item"
              >
                <div className="item_txt">{project.main_title}</div>
                <div className="item_icon">
                  <img src={iconSrc} alt={iconAlt} />
                </div>
              </ItemWrapper>
            );
          })}
        </div>
      </div>
    </>
  );
}

