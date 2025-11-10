// Image 페이지 컴포넌트
import { useState, useEffect } from 'react';
import Title from '../components/Title.jsx';
import Items from '../components/Items.jsx';
import ImageViewer from '../components/ImageViewer.jsx';
import Footer from '../components/Footer.jsx';
import { fetchImageItems, personaSections } from '../data/imageData.js';
// global.scss는 main.jsx에서 전역으로 import됨

export default function Image() {
  // 이미지 데이터, 로딩 상태, 에러 상태 관리
  const [imageItems, setImageItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 선택된 이미지 데이터와 뷰어 열림 상태 관리
  const [selectedImage, setSelectedImage] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // 컴포넌트 마운트 시 Supabase에서 이미지 데이터 가져오기
  useEffect(() => {
    async function loadImageData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchImageItems();
        setImageItems(data);

        if (!data || data.length === 0) {
          setError('데이터가 없습니다. 데이터베이스를 확인하세요.');
        }
      } catch (err) {
        console.error('이미지 데이터 로딩 실패:', err);
        const errorMessage = err?.message || '이미지 데이터를 불러오는데 실패했습니다.';
        setError(`오류: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    }

    loadImageData();
  }, []);

  // 이미지 클릭 핸들러
  const handleItemClick = (item) => {
    setSelectedImage(item);
    setIsViewerOpen(true);
  };

  // 뷰어 닫기 핸들러
  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedImage(null);
  };

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <main>
        <section>
          <div className="head">
            <span className="head_title"></span>
          </div>
        </section>
      </main>
    );
  }

  // 에러 발생 시 표시
  if (error) {
    return (
      <main>
        <section>
          <div className="head">
            <span className="head_title">{error}</span>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section>
        <div className="head">
          <span className="head_title">Image</span>
          <span className="sub_title">I primarily use popular generative AI tools to create images and explore
                    their practical applications in design. I focus on understanding the value and potential of AI to
                    deliver high-quality results efficiently, even with limited time and resources. Additionally, I
                    document prompts and practical tips to optimize outcomes.<br /><br />All images in this document were produced by generative artificial intelligence and do not depict real photographs. Use of these images as design resources is permitted only within the scope of the applicable license terms, including restrictions on commercial use, redistribution, modification, or derivative works where specified.</span>
        </div>
      </section>
      {/* 배열을 map으로 순회하여 동적으로 섹션 생성 (mainTitle과 img_model이 일치하는 데이터만 필터링) */}
      {personaSections.map((persona, index) => {
        // mainTitle과 img_model이 일치하는 데이터만 필터링
        const filteredItems = imageItems.filter(item => item.img_model === persona.mainTitle);

        return (
          <section key={index}>
            <Title
              mainTitle={persona.mainTitle}
              subTitle={persona.subTitle}
            />
            <Items items={filteredItems} onItemClick={handleItemClick} />
          </section>
        );
      })}
      {/* 이미지 뷰어 모달 */}
      <ImageViewer
        isOpen={isViewerOpen}
        imageData={selectedImage}
        onClose={handleCloseViewer}
      />
      {/* Footer 컴포넌트 */}
      <Footer />
    </main>
  );
}

