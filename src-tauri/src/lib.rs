// CodeForge IDE - Core Application Module
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod commands;
mod file_system;
mod types;
mod utils;

use commands::*;
use file_system::FileSystemService;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(FileSystemService::new())
        .invoke_handler(tauri::generate_handler![
            // File system commands
            read_file_content,
            write_file_content,
            create_file,
            create_directory,
            delete_file,
            delete_directory,
            rename_file,
            copy_file,
            move_file,
            list_directory,
            get_file_metadata,
            watch_directory,
            stop_watching_directory,
            // Utility commands
            get_system_info,
            greet
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Keep original greet command for compatibility
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
