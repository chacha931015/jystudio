/* ============================================================
   JY STUDIO — Supabase 연결 설정 (홈페이지와 관리자 앱이 공용으로 사용)

   ↓↓↓ 아래 두 값만 본인 Supabase 프로젝트 값으로 채우세요 ↓↓↓
   위치: Supabase 대시보드 → Project Settings → Data API
     · Project URL  → SUPABASE_URL
     · anon public  → SUPABASE_ANON_KEY
   anon 키는 공개되어도 안전합니다 (RLS 정책이 데이터를 보호).
   ============================================================ */
window.JY_SUPABASE_URL = 'https://juheyqabwnkzhzpuitrj.supabase.co';
window.JY_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aGV5cWFid25remh6cHVpdHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNTAxNDIsImV4cCI6MjEwMDcyNjE0Mn0.170t-f2dN0TXyYQJh4vOtDo77FX-ItKOtAzYX0s4bxY';

window.JY_SB_READY = !!(
  window.JY_SUPABASE_URL && window.JY_SUPABASE_URL !== 'YOUR_SUPABASE_URL' &&
  window.JY_SUPABASE_ANON_KEY && window.JY_SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY'
);
