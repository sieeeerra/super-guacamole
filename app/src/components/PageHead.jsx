// PageHead 컴포넌트: 페이지 상단 헤더 영역 (.head)을 렌더링
// title과 subTitle을 props로 받아서 표시
export default function PageHead({ mainTitle, subTitle }) {
  return (
    <>
      <style>{`
        .page_head {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          padding-top: 80px;
        }

        .page_head .main_title {
          flex: 1;
          font-size: 48px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          text-transform: uppercase;
        }

        .page_head .sub_title {
          flex: 1;
          font-family: "Merriweather", serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5em;
        }

        @media (max-width: 768px) {
        .page_head{
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        }
        br{
        display: none;
        }

        .page_head .main_title {
          font-size: 32px;
        }

        .page_head .sub_title {
          font-size: 14px;
        }
      `}</style>

      <div className="page_head">
        <span className="main_title">{mainTitle || ''}</span>
        {subTitle && <span className="sub_title">{subTitle}</span>}
      </div>
    </>
  );
}