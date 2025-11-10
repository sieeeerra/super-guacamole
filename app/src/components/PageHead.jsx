// PageHead 컴포넌트: 페이지 상단 헤더 영역 (.head)을 렌더링
// title과 subTitle을 props로 받아서 표시
export default function PageHead({ mainTitle, subTitle }) {
  return (
    <div className="page_head">
      <span className="main_title">{mainTitle || ''}</span>
      {subTitle && <span className="sub_title">{subTitle}</span>}
    </div>
  );
}