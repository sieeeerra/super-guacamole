import { supabase } from '../lib/supabase';

// Persona 섹션 데이터
export const personaSections = [
  {
    mainTitle: 'image',
    subTitle: ""
  },
];

// Supabase의 imageData 테이블에서 모든 이미지 데이터 조회
export async function fetchImageItems() {
  try {
    const { data, error } = await supabase
      .from('imageData')
      .select('*')
      .order('img_title', { ascending: false }); // img_title 기준 내림차순 정렬
    
    if (error) {
      console.error('이미지 데이터 조회 오류:', error);
      // NOT_FOUND 에러인 경우 더 명확한 메시지 제공
      if (error.code === 'PGRST116' || error.message?.includes('NOT_FOUND') || error.message?.includes('404')) {
        throw new Error('imageData 테이블을 찾을 수 없습니다. Supabase 데이터베이스 설정을 확인하세요.');
      }
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('이미지 데이터 가져오기 실패:', error);
    throw error;
  }
}