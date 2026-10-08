-- ============================================================
-- 대문 문구를 원래(처음) 문구로 되돌리기 — Supabase SQL Editor 에 붙여 넣고 Run
--   관리자 앱 "대문 문구" 탭에서 저장한 값을 모두 덮어씁니다. 여러 번 실행해도 안전.
-- ============================================================
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
on conflict (key) do update set ko=excluded.ko, en=excluded.en, ja=excluded.ja, zh=excluded.zh, updated_at=now();
