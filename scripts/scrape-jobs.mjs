/* ============================================================
   JY STUDIO — 외주 공고 자동 수집 스크립트
   실행: GitHub Actions(.github/workflows/scrape-jobs.yml)가 6시간마다 자동 실행
   수동 실행: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/scrape-jobs.mjs

   · 공개 목록 페이지만, robots.txt 규칙(Crawl-delay)을 지키며 낮은 빈도로 수집합니다.
   · 키워드에 걸린 공고만 Supabase job_leads 테이블에 저장(URL 기준 중복 제거),
     관리자 앱 "외주공고" 탭에 표시됩니다.
   · 사이트 구조가 바뀌면 어댑터의 정규식만 고치면 됩니다.
   ============================================================ */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('환경변수 SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 가 필요합니다.');
  process.exit(1);
}

/* 관심 키워드 — 제목에 하나라도 포함되면 수집 (JOB_KEYWORDS 환경변수로 덮어쓰기 가능) */
const KEYWORDS = (process.env.JOB_KEYWORDS ||
  '스파인,spine,2d,애니메이션,애니메이터,캐릭터,리깅,모션,일러스트,live2d,라이브2d,이펙트,아트,디자인,게임'
).split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));

function matchedKeywords(title) {
  const t = (title || '').toLowerCase();
  return KEYWORDS.filter(k => t.includes(k));
}
function stripTags(s) {
  return (s || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

/* ---------------- 어댑터: 위시켓 ----------------
   robots.txt: /project/ 허용, Crawl-delay 5초 → 페이지 사이 6초 대기 */
async function scrapeWishket() {
  const jobs = [];
  for (let page = 1; page <= 3; page++) {
    const url = 'https://www.wishket.com/project/' + (page > 1 ? `?page=${page}` : '');
    let html;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'ko' } });
      if (!res.ok) { console.warn(`[wishket] p${page} HTTP ${res.status} — 중단`); break; }
      html = await res.text();
    } catch (e) { console.warn(`[wishket] p${page} 요청 실패: ${e.message}`); break; }

    // <a class="... project-link" href="/project/157206/"><p ...>제목</p></a> ... class="budget ..."
    const parts = html.split(/<a[^>]*class="[^"]*project-link[^"]*"[^>]*href="(\/project\/\d+\/)"[^>]*>/);
    for (let i = 1; i < parts.length; i += 2) {
      const href = parts[i];
      const chunk = parts[i + 1] || '';
      const title = stripTags((chunk.match(/<p[^>]*>([\s\S]*?)<\/p>/) || [])[1]);
      if (!title) continue;
      const budgetRaw = (chunk.match(/class="budget[^"]*"[^>]*>([\s\S]*?)<\/p>/) || [])[1];
      const budget = stripTags(budgetRaw).replace(/^(예상|월)\s*금액\s*/, '');
      const category = stripTags((chunk.match(/project-category-or-role[^"]*"[^>]*>([\s\S]*?)<\/p>/) || [])[1]);
      const kw = matchedKeywords(title + ' ' + category);
      if (!kw.length) continue;
      jobs.push({
        source: 'wishket',
        title,
        url: 'https://www.wishket.com' + href,
        budget: budget || null,
        extra: category || null,
        keywords: kw,
      });
    }
    console.log(`[wishket] ${page}페이지 처리 완료 (누적 매칭 ${jobs.length}건)`);
    await sleep(6000);
  }
  return jobs;
}

/* ----------------------------------------------------------
   새 사이트를 추가하려면 위 scrapeWishket 처럼
   { source, title, url, budget, extra, keywords } 배열을 반환하는
   함수를 만들어 아래 ADAPTERS 에 넣으면 됩니다.
   (프리모아·숨고 등은 목록이 로그인/암호화 통신이라 제외했습니다.
    로그인이 필요한 사이트는 약관 위반 소지가 있으니 넣지 마세요.)
   ---------------------------------------------------------- */
const ADAPTERS = [scrapeWishket];

/* ---------------- Supabase 저장 ---------------- */
async function saveJobs(jobs) {
  if (!jobs.length) { console.log('저장할 새 공고 없음'); return; }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/job_leads?on_conflict=url`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify(jobs),
  });
  if (!res.ok) {
    console.error('Supabase 저장 실패:', res.status, await res.text());
    process.exit(1);
  }
  console.log(`Supabase 저장 완료 (${jobs.length}건 시도, 중복은 자동 무시)`);
}

const all = [];
for (const adapter of ADAPTERS) {
  try { all.push(...await adapter()); }
  catch (e) { console.warn(`어댑터 오류(${adapter.name}): ${e.message}`); }
}
console.log(`총 매칭 공고: ${all.length}건`);
await saveJobs(all);
