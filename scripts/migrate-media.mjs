/* ============================================================
   Supabase 스토리지 → 깃허브 미디어 이전 스크립트
   목적: 포트폴리오 미디어가 Supabase 전송량(월 5GB)을 쓰지 않도록
         파일을 저장소 media/ 폴더로 내려받고, DB 주소 교체용 SQL을 생성

   실행: node scripts/migrate-media.mjs   (Supabase 복구 후에만 동작)
   결과: ./media/에 파일 저장 + ./migrate-media.sql 생성
         → 커밋·푸시 후 SQL을 Supabase SQL Editor에서 RUN
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { basename } from 'path';

const cfg = readFileSync(new URL('../supabase-config.js', import.meta.url), 'utf8');
const URL_ = cfg.match(/JY_SUPABASE_URL\s*=\s*'([^']+)'/)[1];
const KEY = cfg.match(/JY_SUPABASE_ANON_KEY\s*=\s*'([^']+)'/)[1];
const SITE = 'https://jystudio98.com';

const res = await fetch(`${URL_}/rest/v1/portfolio?select=id,title,media,media_type&order=id`, {
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
});
if (!res.ok) {
  console.error(`포트폴리오 조회 실패 (HTTP ${res.status}) — Supabase가 아직 차단 상태일 수 있습니다.`);
  console.error(await res.text());
  process.exit(1);
}
const rows = await res.json();
const targets = rows.filter(r => r.media && r.media.includes('supabase.co/storage'));
console.log(`전체 ${rows.length}개 중 Supabase 스토리지 사용: ${targets.length}개`);
if (!targets.length) { console.log('옮길 파일이 없습니다.'); process.exit(0); }

mkdirSync(new URL('../media', import.meta.url), { recursive: true });
const sql = ['-- 미디어 주소를 깃허브(사이트)로 교체 — Supabase SQL Editor에서 RUN'];

for (const r of targets) {
  const name = decodeURIComponent(basename(new URL(r.media).pathname)).replace(/[^\w.\-]+/g, '_');
  process.stdout.write(`  ↓ [${r.id}] ${r.title} ← ${name} ... `);
  const f = await fetch(r.media);
  if (!f.ok) { console.log(`실패 (HTTP ${f.status})`); continue; }
  const buf = Buffer.from(await f.arrayBuffer());
  writeFileSync(new URL(`../media/${name}`, import.meta.url), buf);
  sql.push(`update public.portfolio set media = '${SITE}/media/${name}' where id = ${r.id};`);
  console.log(`저장 (${(buf.length / 1048576).toFixed(1)}MB)`);
}

writeFileSync(new URL('../migrate-media.sql', import.meta.url), sql.join('\n') + '\n');
console.log(`\n완료! 다음 순서:\n 1) git add media migrate-media.sql → 커밋·푸시\n 2) migrate-media.sql 을 SQL Editor에서 RUN\n 3) (선택) Supabase Storage의 media 버킷 파일 삭제로 저장공간 회수`);
