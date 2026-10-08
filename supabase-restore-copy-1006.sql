-- ============================================================
-- 대문 문구를 10/6 대표님 수정본으로 되돌리기 — Supabase SQL Editor 에 붙여 넣고 Run
--   기록이 남은 10개 칸만 복원. "소개 — 본문"(hero.lead)은 앞부분만 기록이 남아
--   현재 문구를 유지하니, 앱 "대문 문구" 탭에서 직접 다시 입력해 주세요.
-- ============================================================
insert into public.site_copy (key, ko, en, ja, zh) values
  ('hero.eyebrow', 'Spine 2D Animation Outsourcing', 'Spine 2D Animation Outsourcing', 'Spine 2D Animation Outsourcing', 'Spine 2D Animation Outsourcing'),
  ('hero.h1a',  'Spine 2D Animation', 'Spine 2D Animation', 'Spine 2D Animation', 'Spine 2D Animation'),
  ('hero.h1b',  '외주 제작 스튜디오', 'Outsourcing Studio', '外注制作スタジオ', '外包制作工作室'),
  ('hero.leadb','다년간의 제작 경험,', 'Years of production experience,', '長年の制作経験、', '多年的制作经验，'),
  ('pillar1.t', '대규모 제작', 'Large-scale production', '大規模制作', '大规模制作'),
  ('pillar1.d', '프로젝트 규모에 맞춘 유연한 인원 배치', 'Flexible staffing scaled to each project', 'プロジェクト規模に合わせた柔軟な人員配置', '根据项目规模灵活配置人员'),
  ('pillar2.t', '일관된 품질', 'Consistent quality', '一貫した品質', '一致的品质'),
  ('pillar2.d', '전 과정을 내부에서 직접 관리하는 제작 시스템', 'A production system managed fully in house', '全工程を社内で直接管理する制作システム', '全流程内部自主管理的制作体系'),
  ('pillar3.t', '안정적인 일정', 'Reliable schedules', '安定したスケジュール', '稳定的排期'),
  ('pillar3.d', '주어진 기간과 물량에 맞춘 체계적인 운영', 'Systematic operation tailored to time and volume', '期間と物量に合わせた体系的な運営', '依据周期与体量的系统化运作')
on conflict (key) do update set ko=excluded.ko, en=excluded.en, ja=excluded.ja, zh=excluded.zh, updated_at=now();
