// Supabase 클라이언트 설정 파일
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 환경 변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요.');
}

// Supabase 클라이언트 생성 및 export
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

