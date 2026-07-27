# JY 관리자 — 데스크톱 앱 (Tauri)

관리자 웹앱(admin.html)을 내장한 Windows 데스크톱 앱입니다.
데이터는 Supabase에서 실시간으로 불러오므로 인터넷 연결이 필요합니다.

## 다시 빌드하는 방법

`admin.html` 또는 `supabase-config.js`를 수정했다면, 앱에도 반영하려면 다시 빌드해야 합니다:

```powershell
cd desktop-app
Copy-Item ..\admin.html src\index.html -Force
Copy-Item ..\supabase-config.js src\ -Force
npx tauri build
```

빌드 결과:
- 실행 파일: `src-tauri\target\release\JY-Admin.exe` (바탕화면에 복사해서 쓰면 됨)
- 설치 파일: `src-tauri\target\release\bundle\nsis\JY-Admin_…-setup.exe` (다른 PC에 설치할 때)

## 필요 도구 (이미 설치되어 있음)

Rust(cargo), Visual Studio Build Tools(C++), WebView2 런타임, Node.js
