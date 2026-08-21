-- ============================================================
-- 메인(대표) 포트폴리오 교체
--   기존: 별의 여행자 라라 2개  →  변경: 니케 전신 3명
-- 실행 위치: Supabase 대시보드 → SQL Editor → 붙여넣고 Run
-- ============================================================

-- 1) 기존 대표작 전부 해제
update public.portfolio set featured = false;

-- 2) 니케 전신 3명을 대표작으로 지정 (엑시아 / 리타 / 앨리스)
update public.portfolio set featured = true where id in (83, 84, 82);

-- 3) 확인 — 3줄이 나오면 정상
select id, sort_order, category, title, featured
  from public.portfolio where featured order by sort_order;
