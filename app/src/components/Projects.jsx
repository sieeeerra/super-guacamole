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
          // margin-bottom: 25vh;
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
          letter-spacing: -0.04em;
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
          background: #00FF37;
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

        .item_icon svg {
          display: block;
          width: 36px;
          height: 36px;
          path{
            stroke: #333;
          }
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

          .project .project_items .project_item .item_icon svg {
            width: 24px;
            height: 24px;
            display: block;
            path{
              stroke-width: 2;
              stroke: #333;
            }
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

            // 인라인 SVG 아이콘 컴포넌트
            const IconSVG = project.link ? (
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 30L30 10" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                <path d="M13.75 10H30V26.25" stroke="currentColor" stroke-width="1.5" stroke-linejoin="bevel" />
              </svg>
            ) : (
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 6.25L32.5 33.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="bevel" />
                <path d="M24.2047 24.625C22.9781 25.7402 21.3587 26.3224 19.7028 26.2435C18.0469 26.1647 16.4902 25.4313 15.375 24.2047C14.2598 22.9781 13.6776 21.3587 13.7565 19.7028C13.8353 18.0469 14.5687 16.4902 15.7953 15.375" stroke="black" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="bevel" />
                <path d="M21.1766 13.8608C22.5053 14.1153 23.7156 14.794 24.6257 15.7951C25.5357 16.7962 26.0964 18.0655 26.2235 19.4124" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="bevel" />
                <path d="M32.5953 26.4219C36.0016 23.3719 37.5 20 37.5 20C37.5 20 32.5 8.75002 20 8.75002C18.9175 8.74854 17.8368 8.83634 16.7687 9.01252" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="bevel" />
                <path d="M11.5625 10.7188C5.19219 13.9437 2.5 20 2.5 20C2.5 20 7.5 31.25 20 31.25C22.9289 31.273 25.8212 30.5981 28.4375 29.2812" stroke="currentColor" stroke-width="1.5" stroke-linejoin="bevel" />
              </svg>
            );

            return (
              <ItemWrapper
                key={index}
                {...(project.link && { href: project.link, target: '_blank' })}
                className="project_item"
              >
                <div className="item_txt">{project.main_title}</div>
                <div className="item_icon">
                  {IconSVG}
                </div>
              </ItemWrapper>
            );
          })}
        </div>
      </div >
    </>
  );
}

