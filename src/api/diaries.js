import { supabase } from '../lib/supabase.js'

function getClient() {
  if (!supabase) {
    throw new Error(
      'Supabase 환경변수가 설정되지 않았어요. .env.local의 URL과 publishable key를 확인해 주세요.',
    )
  }

  return supabase
}

export async function listDiaries() {
  const { data, error } = await getClient()
    .from('diaries')
    .select('id, content, emotion, created_at')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createDiary({ content, emotion }) {
  const { data, error } = await getClient()
    .from('diaries')
    .insert({ content, emotion })
    .select('id, content, emotion, created_at')
    .single()

  if (error) throw error
  return data
}

export async function deleteDiary(id) {
  const { error } = await getClient().from('diaries').delete().eq('id', id)

  if (error) throw error
}
