// 관리자 데스크톱 앱 배포 — 설치된 앱들이 다음 실행 때 스스로 업데이트한다.
//   node scripts/release-app.mjs 1.13.1 "바뀐 점 한 줄"
// 하는 일: admin.html 내장 → 버전 올림 → 서명 빌드 → app/ 에 설치파일 + latest.json → 커밋·푸시
// 서명 키: C:\Users\USER\.tauri\jy-admin.key (잃어버리면 더 이상 자동 업데이트 불가 — 백업해 둘 것)
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const [version, notes = ''] = process.argv.slice(2);
if (!/^\d+\.\d+\.\d+$/.test(version || '')) { console.error('사용법: node scripts/release-app.mjs 1.13.1 "메모"'); process.exit(1); }

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const app = path.join(root, 'desktop-app');
const run = (cmd, cwd = root, env = {}) => execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, ...env } });

// 1) 화면(admin.html) 내장 + 버전
fs.copyFileSync(path.join(root, 'admin.html'), path.join(app, 'src', 'index.html'));
fs.copyFileSync(path.join(root, 'supabase-config.js'), path.join(app, 'src', 'supabase-config.js'));
const confPath = path.join(app, 'src-tauri', 'tauri.conf.json');
const conf = JSON.parse(fs.readFileSync(confPath, 'utf8'));
conf.version = version;
fs.writeFileSync(confPath, JSON.stringify(conf, null, 2) + '\n');

// 2) 서명 빌드
const keyPath = path.join(os.homedir(), '.tauri', 'jy-admin.key');
run('npx tauri build', app, {
  TAURI_SIGNING_PRIVATE_KEY: fs.readFileSync(keyPath, 'utf8'),
  TAURI_SIGNING_PRIVATE_KEY_PASSWORD: '',
});

// 3) app/ 에 설치파일과 latest.json
const nsis = path.join(app, 'src-tauri', 'target', 'release', 'bundle', 'nsis');
const exe = `JY-Admin_${version}_x64-setup.exe`;
const outDir = path.join(root, 'app');
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) if (f.endsWith('-setup.exe')) fs.unlinkSync(path.join(outDir, f));   // 옛 설치파일 정리
fs.copyFileSync(path.join(nsis, exe), path.join(outDir, exe));
const latest = {
  version,
  notes,
  pub_date: new Date().toISOString(),
  platforms: {
    'windows-x86_64': {
      signature: fs.readFileSync(path.join(nsis, exe + '.sig'), 'utf8').trim(),
      url: `https://jystudio98.com/app/${exe}`,
    },
  },
};
fs.writeFileSync(path.join(outDir, 'latest.json'), JSON.stringify(latest, null, 2) + '\n');

// 4) 커밋·푸시 → GitHub Pages 반영(약 1분) 후 설치된 앱들이 다음 실행 때 업데이트
run(`git add app desktop-app/src-tauri/tauri.conf.json desktop-app/src/index.html desktop-app/src/supabase-config.js`);
const trailer = process.env.RELEASE_TRAILER ? ` -m "${process.env.RELEASE_TRAILER}"` : '';
run(`git commit -m "관리자 앱 v${version} 배포${notes ? ' — ' + notes.replace(/"/g, "'") : ''}"${trailer}`);
run('git push');
console.log(`\n배포 완료: v${version} — 설치된 앱은 다음 실행 때 자동 업데이트됩니다.`);
