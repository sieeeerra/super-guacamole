// items 배열을 props로 받아서 렌더링 (각 item {img_src, img_title, img_model, img_description})
// 이미지 클릭 시 onItemClick 콜백 호출
export default function ImageItems({ items, onItemClick }) {
  // 이미지 클릭 핸들러
  const handleImageClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div className="items">
      {items.map((item, index) => (
        <div key={index} className="item">
          <div className="img" onClick={() => handleImageClick(item)}>
            <img src={item.img_src} alt={item.img_title || 'Image'} />
          </div>
          {/* <div className="img_title">
            <span>{item.img_title}</span>
          </div> */}
        </div>
      ))}
    </div>
  );
}

