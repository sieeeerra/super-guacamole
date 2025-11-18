import { supabase } from '../lib/supabase';

// Supabase의 projectData 테이블에서 모든 프로젝트 데이터 조회
export async function fetchProjects() {
  try {
    const { data, error } = await supabase
      .from('projectData')
      .select('*')
      .order('id', { ascending: true }); // id 기준 오름차순 정렬
    
    if (error) {
      console.error('프로젝트 데이터 조회 오류:', error);
      // NOT_FOUND 에러인 경우 더 명확한 메시지 제공
      if (error.code === 'PGRST116' || error.message?.includes('NOT_FOUND') || error.message?.includes('404')) {
        throw new Error('projectData 테이블을 찾을 수 없습니다. Supabase 데이터베이스 설정을 확인하세요.');
      }
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('프로젝트 데이터 가져오기 실패:', error);
    throw error;
  }
}
