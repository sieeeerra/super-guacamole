// mainTitle과 subTitle을 props로 받아서 렌더링
export default function Title({ mainTitle, subTitle }) {
  return (
    <div className="title">
      <span className="main_title">{mainTitle}</span>
      <span className="sub_title">{subTitle}</span>
    </div>
  );
}

