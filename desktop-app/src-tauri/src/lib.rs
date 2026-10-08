// 정읍 스튜디오 관리자 — Windows에서 창 모서리를 OS 레벨로 둥글게 처리
#[cfg(target_os = "windows")]
fn set_round_region(hwnd: *mut core::ffi::c_void, maximized: bool, w: i32, h: i32, scale: f64) {
  use windows_sys::Win32::Graphics::Gdi::{CreateRoundRectRgn, SetWindowRgn};
  unsafe {
    if maximized {
      SetWindowRgn(hwnd as _, std::ptr::null_mut(), 1);
    } else {
      let d = (26.0 * scale) as i32; // CSS border-radius 13px과 일치
      let rgn = CreateRoundRectRgn(0, 0, w + 1, h + 1, d, d);
      SetWindowRgn(hwnd as _, rgn, 1);
    }
  }
}

#[cfg(target_os = "windows")]
fn round_window(window: &tauri::Window) {
  let Ok(hwnd) = window.hwnd() else { return };
  let Ok(size) = window.outer_size() else { return };
  let maximized = window.is_maximized().unwrap_or(false);
  let scale = window.scale_factor().unwrap_or(1.0);
  set_round_region(hwnd.0 as _, maximized, size.width as i32, size.height as i32, scale);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_updater::Builder::new().build())
    .setup(|app| {
      // 자동 업데이트 — 시작할 때 https://jystudio98.com/app/latest.json 을 확인해서 새 버전이면
      // 받아서 설치(진행 막대만 잠깐 뜸)하고 다시 켠다. 오프라인이거나 실패하면 그냥 지금 버전으로 계속
      {
        let handle = app.handle().clone();
        tauri::async_runtime::spawn(async move {
          use tauri_plugin_updater::UpdaterExt;
          if let Ok(updater) = handle.updater() {
            if let Ok(Some(update)) = updater.check().await {
              if update.download_and_install(|_, _| {}, || {}).await.is_ok() {
                handle.restart();
              }
            }
          }
        });
      }
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      #[cfg(target_os = "windows")]
      {
        use tauri::Manager;
        if let Some(w) = app.get_webview_window("main") {
          let Ok(hwnd) = w.hwnd() else { return Ok(()) };
          let Ok(size) = w.outer_size() else { return Ok(()) };
          let maximized = w.is_maximized().unwrap_or(false);
          let scale = w.scale_factor().unwrap_or(1.0);
          set_round_region(hwnd.0 as _, maximized, size.width as i32, size.height as i32, scale);
        }
      }
      Ok(())
    })
    .on_window_event(|_window, _event| {
      #[cfg(target_os = "windows")]
      if matches!(_event, tauri::WindowEvent::Resized(_)) {
        round_window(_window);
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
