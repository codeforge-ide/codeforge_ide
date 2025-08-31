/**
 * Shared types for CodeForge IDE Tauri backend
 * Defines common data structures used across the application
 */
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;

/// File metadata information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileMetadata {
    pub path: String,
    pub name: String,
    pub size: u64,
    pub is_directory: bool,
    pub is_file: bool,
    pub is_symlink: bool,
    pub readonly: bool,
    pub hidden: bool,
    pub created: Option<u64>,
    pub modified: Option<u64>,
    pub accessed: Option<u64>,
    pub permissions: String,
    pub extension: Option<String>,
    pub mime_type: Option<String>,
}

/// Directory entry for file explorer
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DirectoryEntry {
    pub name: String,
    pub path: String,
    pub is_directory: bool,
    pub size: Option<u64>,
    pub modified: Option<u64>,
    pub permissions: String,
    pub icon: String,
}

/// File operation result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileOperationResult {
    pub success: bool,
    pub message: String,
    pub path: Option<String>,
    pub error_code: Option<String>,
}

/// File content response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileContent {
    pub path: String,
    pub content: String,
    pub encoding: String,
    pub size: u64,
    pub is_binary: bool,
}

/// Directory listing response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DirectoryListing {
    pub path: String,
    pub entries: Vec<DirectoryEntry>,
    pub total_count: usize,
    pub hidden_count: usize,
    pub error: Option<String>,
}

/// File watcher event
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WatchEvent {
    pub event_type: WatchEventType,
    pub path: String,
    pub timestamp: u64,
}

/// Types of file system events
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WatchEventType {
    Created,
    Modified,
    Deleted,
    Renamed,
    Other,
}

/// System information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemInfo {
    pub os: String,
    pub arch: String,
    pub platform: String,
    pub hostname: String,
    pub username: String,
    pub home_dir: Option<String>,
    pub current_dir: Option<String>,
    pub temp_dir: String,
    pub path_separator: String,
}

/// Configuration for file operations
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileOperationConfig {
    pub overwrite: bool,
    pub create_parent_dirs: bool,
    pub preserve_permissions: bool,
    pub follow_symlinks: bool,
}

/// Error types for file operations
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FileSystemError {
    NotFound,
    PermissionDenied,
    AlreadyExists,
    InvalidPath,
    IOError(String),
    UnknownError(String),
}

impl std::fmt::Display for FileSystemError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            FileSystemError::NotFound => write!(f, "File or directory not found"),
            FileSystemError::PermissionDenied => write!(f, "Permission denied"),
            FileSystemError::AlreadyExists => write!(f, "File or directory already exists"),
            FileSystemError::InvalidPath => write!(f, "Invalid path"),
            FileSystemError::IOError(msg) => write!(f, "IO Error: {}", msg),
            FileSystemError::UnknownError(msg) => write!(f, "Unknown error: {}", msg),
        }
    }
}

/// Search criteria for file operations
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchCriteria {
    pub query: String,
    pub case_sensitive: bool,
    pub regex: bool,
    pub include_hidden: bool,
    pub file_extensions: Vec<String>,
    pub max_results: Option<usize>,
}

/// Search result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchResult {
    pub path: String,
    pub matches: Vec<SearchMatch>,
    pub total_matches: usize,
}

/// Individual search match
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchMatch {
    pub line_number: usize,
    pub column: usize,
    pub text: String,
    pub preview: String,
}

/// File copy/move progress
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TransferProgress {
    pub operation: String,
    pub source: String,
    pub destination: String,
    pub bytes_transferred: u64,
    pub total_bytes: u64,
    pub percentage: f64,
    pub speed_bytes_per_sec: u64,
    pub estimated_seconds_remaining: Option<u64>,
}

/// Project workspace information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkspaceInfo {
    pub path: String,
    pub name: String,
    pub config_files: Vec<String>,
    pub git_repository: Option<GitInfo>,
    pub project_type: Option<String>,
}

/// Git repository information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GitInfo {
    pub branch: String,
    pub remote_url: Option<String>,
    pub has_changes: bool,
    pub ahead: usize,
    pub behind: usize,
}

/// Application preferences
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppPreferences {
    pub theme: String,
    pub font_family: String,
    pub font_size: u8,
    pub tab_size: u8,
    pub word_wrap: bool,
    pub show_hidden_files: bool,
    pub auto_save: bool,
    pub auto_save_delay: u32,
}

/// Command execution result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommandResult {
    pub success: bool,
    pub stdout: String,
    pub stderr: String,
    pub exit_code: Option<i32>,
    pub execution_time_ms: u64,
}
