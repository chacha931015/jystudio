/* ============================================================
   포트폴리오 스냅샷 생성기
   DB의 현재 포트폴리오를 portfolio-fallback.json 으로 저장.
   Supabase가 응답하지 않을 때 홈페이지가 이 파일로 최신 모습을 유지함.

   실행: node scripts/snapshot-portfolio.mjs
   (포트폴리오를 크게 바꾼 뒤에 가끔 한 번씩 실행 → 커밋·푸시)
   ============================================================ */
import { readFileSync, writeFileSync } from 'fs';
import { basename } from 'path';

const cfg = readFileSync(new URL('../supabase-config.js', import.meta.url), 'utf8');
const URL_ = cfg.match(/JY_SUPABASE_URL\s*=\s*'([^']+)'/)[1];
const KEY = cfg.match(/JY_SUPABASE_ANON_KEY\s*=\s*'([^']+)'/)[1];
const SITE = 'https://jystudio98.com';

const res = await fetch(`${URL_}/rest/v1/portfolio?select=sort_order,category,title,media_type,media,description,featured&order=sort_order.asc,created_at.desc`, {
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
});
if (!res.ok) { console.error(`조회 실패 (HTTP ${res.status})`); process.exit(1); }
let rows = await res.json();

// Supabase 스토리지 주소는 사이트(media/) 주소로 치환해 저장 (이전 작업과 짝)
rows = rows.map(r => {
  if (r.media && r.media.includes('supabase.co/storage')) {
    const name = decodeURIComponent(basename(new URL(r.media).pathname)).replace(/[^\w.\-]+/g, '_');
    r = { ...r, media: `${SITE}/media/${name}` };
  }
  return r;
});

writeFileSync(new URL('../portfolio-fallback.json', import.meta.url), JSON.stringify(rows, null, 1));
console.log(`portfolio-fallback.json 저장 완료 (${rows.length}개 항목)`);
