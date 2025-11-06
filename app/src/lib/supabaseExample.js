// Supabase 사용 예시 파일
// 이 파일은 참고용이며, 실제 프로젝트에서 사용할 때는 삭제하거나 참고용으로만 사용하세요

import { supabase } from './supabase';

// 예시 1: 데이터 조회 (SELECT)
export async function fetchData() {
  const { data, error } = await supabase
    .from('your_table_name')
    .select('*');
  
  if (error) {
    console.error('데이터 조회 오류:', error);
    return null;
  }
  
  return data;
}

// 예시 2: 데이터 추가 (INSERT)
export async function insertData(newData) {
  const { data, error } = await supabase
    .from('your_table_name')
    .insert([newData]);
  
  if (error) {
    console.error('데이터 추가 오류:', error);
    return null;
  }
  
  return data;
}

// 예시 3: 데이터 수정 (UPDATE)
export async function updateData(id, updatedData) {
  const { data, error } = await supabase
    .from('your_table_name')
    .update(updatedData)
    .eq('id', id);
  
  if (error) {
    console.error('데이터 수정 오류:', error);
    return null;
  }
  
  return data;
}

// 예시 4: 데이터 삭제 (DELETE)
export async function deleteData(id) {
  const { data, error } = await supabase
    .from('your_table_name')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('데이터 삭제 오류:', error);
    return null;
  }
  
  return data;
}

// 예시 5: 실시간 구독 (Realtime)
export function subscribeToTable(callback) {
  const subscription = supabase
    .channel('your_channel_name')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'your_table_name' },
      callback
    )
    .subscribe();
  
  return subscription;
}

