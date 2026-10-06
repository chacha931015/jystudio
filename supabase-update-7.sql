-- ============================================================
-- supabase-update-7.sql — 홈페이지 대문 문구를 관리자 앱에서 편집
--   site_copy: key 별 한국어/영어/일본어/중국어 문구 (index.html 의 data-i18n 키와 같다)
--   누구나 읽고(anon), 로그인한 관리자만 쓴다. 여러 번 실행해도 안전(멱등).
-- ============================================================
create table if not exists public.site_copy (
  key        text primary key,
  ko         text,
  en         text,
  ja         text,
  zh         text,
  updated_at timestamptz not null default now()
);
alter table public.site_copy enable row level security;
drop policy if exists "site_copy_read"  on public.site_copy;
drop policy if exists "site_copy_write" on public.site_copy;
create policy "site_copy_read"  on public.site_copy for select to anon, authenticated using (true);
create policy "site_copy_write" on public.site_copy for all to authenticated using (true) with check (true);

-- 현재 홈페이지 문구를 초기값으로 (이미 있으면 건드리지 않음)
insert into public.site_copy (key, ko, en, ja, zh) values
  ('hero.eyebrow', 'Spine 2D Animation Outsourcing', 'Spine 2D Animation Outsourcing', 'Spine 2D Animation Outsourcing', 'Spine 2D Animation Outsourcing'),
  ('hero.h1a', '대량 제작도 안정적으로,', 'Scale without compromise,', '大量制作も安定して、', '大批量制作也稳定，'),
  ('hero.h1b', '퀄리티는 일관되게', 'quality that stays consistent', '品質は一貫して', '品质始终如一'),
  ('hero.leadb', '게임을 위한 SPINE 2D 리소스 외주 전문 스튜디오.', 'A Spine 2D asset outsourcing studio for games.', 'ゲームのためのSpine 2Dリソース外注専門スタジオ。', '专注游戏 Spine 2D 资源外包的工作室。'),
  ('hero.lead', '전 제작 과정을 직접 관리하며, 일정과 수량에 따른 안정적인 납품으로 신뢰할 수 있는 파트너가 되겠습니다.', 'We manage the entire production process in house and deliver reliably against your schedule and volume.', '全制作工程を自社で管理し、スケジュールと物量に応じた安定した納品でお応えします。', '我们全程自主管理制作流程，按期按量稳定交付。'),
  ('pillar1.t', '대량 수주 대응', 'Built for volume', '大量受注対応', '承接大批量订单'),
  ('pillar1.d', '프로젝트 규모에 맞춘 유연한 제작', 'Production that flexes with project scale', 'プロジェクト規模に合わせた柔軟な制作', '根据项目规模灵活制作'),
  ('pillar2.t', '일관된 품질 관리', 'Consistent quality', '一貫した品質管理', '一致的品质管理'),
  ('pillar2.d', '전 과정을 직접 관리하는 제작 시스템', 'A pipeline we run end to end', '全工程を自社で管理する制作システム', '全流程自主管理的制作体系'),
  ('pillar3.t', '안정적인 일정 대응', 'Schedules you can plan around', '安定したスケジュール対応', '稳定的排期应对'),
  ('pillar3.d', '주어진 기간과 물량에 맞춘 체계적인 운영', 'Systematic delivery against time and volume', '期間と物量に合わせた体系的な運営', '依据周期与体量的系统化运作')
on conflict (key) do nothing;
