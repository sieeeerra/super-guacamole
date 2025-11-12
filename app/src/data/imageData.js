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
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('이미지 데이터 가져오기 실패:', error);
    throw error;
  }
}