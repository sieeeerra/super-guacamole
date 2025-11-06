// imageViewer modal component
export default function ImageViewer({ isOpen, imageData, onClose }) {
  // 이미지 데이터가 없으면 렌더링하지 않음
  if (!isOpen || !imageData) {
    return null;
  }

  // 프롬프트 텍스트 복사
  const handleCopyPrompt = () => {
    if (imageData.img_description) {
      navigator.clipboard.writeText(imageData.img_description)
        .then(() => {
          console.log('프롬프트가 클립보드에 복사되었습니다.');
        })
        .catch((err) => {
          console.error('복사 실패:', err);
        });
    }
  };

  return (
    <div className="image_viewer_overlay">
      <section className="img_viewer">
        {/* 모바일 버튼 */}
        <div className="mobile_button">
          <button className="mobile_copy_button" onClick={handleCopyPrompt}>Copy prompt</button>
          <button className="mobile_close_button" onClick={onClose}>close</button>
        </div>

        {/* 이미지 표시 영역 */}
        <div className="img_src" onClick={onClose}>
          <img src={imageData.img_src} alt={imageData.img_title || 'Image'} />
        </div>

        {/* 이미지 상세 정보 영역 */}
        <div className="prompt_wrap">
          <button className="copy_button" onClick={handleCopyPrompt}>Copy prompt</button>
          <div className="prompt_content">
            <span className="prompt_title">Prompt</span>
            <span className="prompt_description">{imageData.img_description || ''}</span>
          </div>
        </div>
      </section >
    </div >
  );
}

