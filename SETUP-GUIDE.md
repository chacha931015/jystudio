# JY STUDIO 관리자 앱 — 설치 가이드

홈페이지(GitHub Pages)는 서버가 없으므로, 무료 서비스인 **Supabase**를 데이터 저장소 겸
실시간 통신 서버로 사용합니다. 아래 순서대로 한 번만 설정하면 됩니다. (약 15분)

---

## 1단계. Supabase 프로젝트 만들기 (무료)

1. https://supabase.com 접속 → **Start your project** → GitHub 계정으로 가입
2. **New project** 클릭
   - Name: `jystudio` (아무거나)
   - Database Password: 아무 비밀번호나 만들고 **따로 메모** (나중에 쓸 일 거의 없음)
   - Region: `Northeast Asia (Seoul)` 선택
3. 프로젝트 생성 완료까지 1~2분 대기

## 2단계. 데이터베이스 설정 (SQL 한 번 실행)

1. Supabase 대시보드 왼쪽 메뉴 → **SQL Editor**
2. 이 저장소의 [`supabase-setup.sql`](supabase-setup.sql) 파일 내용 **전체 복사** → 붙여넣기 → **RUN**
3. "Success" 가 나오면 완료 (여러 번 실행해도 안전합니다)

## 3단계. 관리자 계정 만들기

1. 왼쪽 메뉴 → **Authentication** → **Users** → **Add user** → **Create new user**
   - 본인 이메일 / 비밀번호 입력 → 생성
2. **중요:** Authentication → **Sign In / Up** (또는 Providers) → Email 설정에서
   **"Allow new users to sign up" 을 반드시 OFF** — 이래야 관리자 외에는 아무도 가입 못 합니다.

## 4단계. 홈페이지에 키 연결

1. 왼쪽 메뉴 → **Project Settings**(톱니바퀴) → **Data API**
2. 두 값을 복사:
   - **Project URL** (예: `https://abcdefgh.supabase.co`)
   - **anon public** 키
3. 이 저장소의 [`supabase-config.js`](supabase-config.js) 파일을 열어 두 값을 붙여넣기:
   ```js
   window.JY_SUPABASE_URL = 'https://abcdefgh.supabase.co';
   window.JY_SUPABASE_ANON_KEY = 'eyJhbGci...';
   ```
   > anon 키는 공개되어도 안전합니다 (RLS 보안 정책이 데이터를 보호).
   > 단, **service_role 키는 절대 이 파일에 넣지 마세요.**
4. 변경사항을 커밋 & 푸시하면 몇 분 뒤 사이트에 반영됩니다.

## 5단계. 앱 설치 (관리자 전용)

`https://내도메인/admin.html` 접속 → 3단계에서 만든 계정으로 로그인.

**휴대폰/PC에 "앱"으로 설치:**
- **안드로이드 (Chrome):** admin.html 접속 → 메뉴(⋮) → **홈 화면에 추가** / 상단의 "⬇ 앱 설치" 버튼
- **아이폰 (Safari):** admin.html 접속 → 공유 버튼 → **홈 화면에 추가**
  - 알림을 받으려면 iOS 16.4 이상 + 홈 화면에 추가한 상태에서 사용해야 합니다
- **PC (Chrome/Edge):** 주소창 오른쪽 설치 아이콘 클릭, 또는 앱 상단 "⬇ 앱 설치" 버튼

설치하면 홈 화면 아이콘으로 실행되는 독립 앱처럼 동작합니다.
앱 안에서 **🔔 알림 켜기** 버튼을 눌러 브라우저 알림을 허용하세요.
새 문의가 오면 소리 + 알림 + 앱 아이콘 배지로 표시됩니다.
(앱/브라우저가 완전히 종료된 상태에서는 알림이 오지 않습니다 — 백그라운드에 켜두세요.)

## 6단계. 외주 공고 자동 수집 설정 (선택)

GitHub Actions가 6시간마다 위시켓 공개 목록에서 키워드에 맞는 공고를 모아
관리자 앱 **외주공고** 탭에 넣어줍니다.

1. Supabase 대시보드 → Project Settings → **API Keys** → **service_role** 키 복사
   (⚠️ 이 키는 모든 권한을 가지므로 GitHub Secrets 외에는 어디에도 넣지 마세요)
2. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - `SUPABASE_URL` = Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role 키
3. (선택) 키워드 변경: 같은 화면의 **Variables** 탭 → `JOB_KEYWORDS` 추가
   - 예: `스파인,spine,애니메이션,캐릭터,리깅,live2d`
4. 저장소 → **Actions** 탭 → "외주 공고 자동 수집" → **Run workflow** 로 즉시 테스트 가능

> 수집은 공개 목록 페이지만, 해당 사이트 robots.txt 규칙(요청 간격)을 지키며 6시간에 한 번만 접근합니다.
> 로그인이 필요한 사이트(숨고 등)는 약관 위반 소지가 있어 지원하지 않습니다.

---

## 기능 정리

| 기능 | 어디서 | 비고 |
|---|---|---|
| 포트폴리오 보기/추가/수정/삭제 | 앱 → 🎨 포트폴리오 | 저장하면 홈페이지에 바로 반영. 파일 업로드 가능(50MB) |
| 공지 글 작성/수정 | 앱 → 📢 공지 | |
| 실시간 문의 채팅 | 홈페이지 오른쪽 아래 💬 버튼 ↔ 앱 → 💬 문의 | 새 문의 시 소리+알림+배지 |
| 문의 폼 | 홈페이지 Get a Quote 폼 | 메일 앱 열림 + 앱 문의함에도 자동 저장 |
| 방문 통계 | 앱 → 📊 대시보드 | 방문 수·국가·기기·유입경로 그래프 (IP 기반 추정) |
| 외주 공고 | 앱 → 💼 외주공고 | GitHub Actions 자동 수집 (6단계 설정 필요) |

## 자주 묻는 질문

**Q. 홈페이지 포트폴리오가 안 바뀌어요.**
DB(`portfolio` 테이블)에 데이터가 1개 이상 있어야 DB 내용으로 교체됩니다.
비어 있으면 기존 하드코딩된 포트폴리오가 그대로 나옵니다.

**Q. 채팅 답장은 상대방에게 어떻게 가나요?**
방문자가 사이트를 열어두고 있으면 실시간으로 전달됩니다. 이미 떠났다면
방문자가 다시 접속했을 때 채팅창에서 확인할 수 있고, 이메일을 남긴 경우 이메일로 회신하세요.

**Q. 방문 통계에 내 접속도 잡히나요?**
관리자 앱에 한 번 로그인한 브라우저는 통계에서 자동 제외됩니다.

**Q. 비용은?**
Supabase 무료 플랜(월 5만 방문 수준은 충분), GitHub Actions 무료 한도로 모두 커버됩니다.
