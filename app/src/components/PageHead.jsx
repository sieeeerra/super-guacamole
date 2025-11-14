// PageHead 컴포넌트: 페이지 상단 헤더 영역 (.head)을 렌더링
// title과 subTitle을 props로 받아서 표시
// 변경: subTitle을 subTitle1, subTitle2로 분리하고 sub_title_wrap으로 감싸도록 수정
export default function PageHead({ mainTitle, subTitle1, subTitle2 }) {
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

        .page_head .sub_title_wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .page_head .sub_title {
          font-family: "Merriweather", serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5em;
        }

        @media (max-width: 768px) {
        .page_head{
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        }

        .page_head .main_title {
          font-size: 32px;
        }

        .page_head .sub_title_wrap {
          gap: 6px;
        }

        .page_head .sub_title {
          font-size: 14px;
        }
      `}</style>

      <div className="page_head">
        <span className="main_title">{mainTitle || ''}</span>
        {(subTitle1 || subTitle2) && (
          <div className="sub_title_wrap">
            {subTitle1 && <span className="sub_title">{subTitle1}</span>}
            {subTitle2 && <span className="sub_title">{subTitle2}</span>}
          </div>
        )}
      </div>
    </>
  );
}