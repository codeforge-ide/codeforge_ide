/**
 * File System Service for CodeForge IDE
 * Provides comprehensive file operations with error handling and performance optimization
 */

use crate::types::*;
use notify::{Watcher, RecursiveMode, Event};
use serde_json;
use std::collections::HashMap;
use std::fs::{self, File, OpenOptions};
use std::io::{self, Read, Write, BufRead, BufReader};
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::async_runtime::spawn;
use tokio::sync::mpsc;

pub struct FileSystemService {
    watchers: Arc<Mutex<HashMap<String, notify::RecommendedWatcher>>>,
    config: FileOperationConfig,
}

impl FileSystemService {
    pub fn new() -> Self {
        Self {
            watchers: Arc::new(Mutex::new(HashMap::new())),
            config: FileOperationConfig {
                overwrite: false,
                create_parent_dirs: true,
                preserve_permissions: true,
                follow_symlinks: false,
            },
        }
    }

    /// Read file content as string
    pub fn read_file(&self, path: &str) -> Result<FileContent, FileSystemError> {
        let file_path = Path::new(path);

        if !file_path.exists() {
            return Err(FileSystemError::NotFound);
        }

        if !file_path.is_file() {
            return Err(FileSystemError::InvalidPath);
        }

        // Check if file is binary
        let is_binary = self.is_binary_file(file_path)?;

        if is_binary {
            return Ok(FileContent {
                path: path.to_string(),
                content: String::new(),
                encoding: "binary".to_string(),
                size: file_path.metadata().map_err(|e| FileSystemError::IOError(e.to_string()))?.len(),
                is_binary: true,
            });
        }

        let mut file = File::open(file_path)
            .map_err(|e| match e.kind() {
                io::ErrorKind::NotFound => FileSystemError::NotFound,
                io::ErrorKind::PermissionDenied => FileSystemError::PermissionDenied,
                _ => FileSystemError::IOError(e.to_string()),
            })?;

        let mut content = String::new();
        file.read_to_string(&mut content)
            .map_err(|e| FileSystemError::IOError(e.to_string()))?;

        let metadata = file_path.metadata()
            .map_err(|e| FileSystemError::IOError(e.to_string()))?;

        Ok(FileContent {
            path: path.to_string(),
            content,
            encoding: "utf-8".to_string(),
            size: metadata.len(),
            is_binary: false,
        })
    }

    /// Write content to file
    pub fn write_file(&self, path: &str, content: &str) -> Result<FileOperationResult, FileSystemError> {
        let file_path = Path::new(path);

        // Create parent directories if they don't exist
        if self.config.create_parent_dirs {
            if let Some(parent) = file_path.parent() {
                fs::create_dir_all(parent)
                    .map_err(|e| FileSystemError::IOError(e.to_string()))?;
            }
        }

        // Check if file exists and we're not allowed to overwrite
        if file_path.exists() && !self.config.overwrite {
            return Err(FileSystemError::AlreadyExists);
        }

        let mut file = OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(file_path)
            .map_err(|e| match e.kind() {
                io::ErrorKind::PermissionDenied => FileSystemError::PermissionDenied,
                _ => FileSystemError::IOError(e.to_string()),
            })?;

        file.write_all(content.as_bytes())
            .map_err(|e| FileSystemError::IOError(e.to_string()))?;

        file.flush()
            .map_err(|e| FileSystemError::IOError(e.to_string()))?;

        Ok(FileOperationResult {
            success: true,
            message: "File written successfully".to_string(),
            path: Some(path.to_string()),
            error_code: None,
        })
    }

    /// Create a new file
    pub fn create_file(&self, path: &str) -> Result<FileOperationResult, FileSystemError> {
        let file_path = Path::new(path);

        if file_path.exists() {
            return Err(FileSystemError::AlreadyExists);
        }

        // Create parent directories if needed
        if let Some(parent) = file_path.parent() {
            fs::create_dir_all(parent)
                .map_err(|e| FileSystemError::IOError(e.to_string()))?;
        }

        File::create(file_path)
            .map_err(|e| match e.kind() {
                io::ErrorKind::PermissionDenied => FileSystemError::PermissionDenied,
                _ => FileSystemError::IOError(e.to_string()),
            })?;

        Ok(FileOperationResult {
            success: true,
            message: "File created successfully".to_string(),
            path: Some(path.to_string()),
            error_code: None,
        })
    }

    /// Create a new directory
    pub fn create_directory(&self, path: &str) -> Result<FileOperationResult, FileSystemError> {
        let dir_path = Path::new(path);

        if dir_path.exists() {
            return Err(FileSystemError::AlreadyExists);
        }

        fs::create_dir_all(dir_path)
            .map_err(|e| match e.kind() {
                io::ErrorKind::PermissionDenied => FileSystemError::PermissionDenied,
                _ => FileSystemError::IOError(e.to_string()),
            })?;

        Ok(FileOperationResult {
            success: true,
            message: "Directory created successfully".to_string(),
            path: Some(path.to_string()),
            error_code: None,
        })
    }

    /// Delete a file
    pub fn delete_file(&self, path: &str) -> Result<FileOperationResult, FileSystemError> {
        let file_path = Path::new(path);

        if !file_path.exists() {
            return Err(FileSystemError::NotFound);
        }

        if !file_path.is_file() {
            return Err(FileSystemError::InvalidPath);
        }

        fs::remove_file(file_path)
            .map_err(|e| match e.kind() {
                io::ErrorKind::NotFound => FileSystemError::NotFound,
                io::ErrorKind::PermissionDenied => FileSystemError::PermissionDenied,
                _ => FileSystemError::IOError(e.to_string()),
            })?;

        Ok(FileOperationResult {
            success: true,
            message: "File deleted successfully".to_string(),
            path: Some(path.to_string()),
            error_code: None,
        })
    }

    /// Delete a directory
    pub fn delete_directory(&self, path: &str) -> Result<FileOperationResult, FileSystemError> {
        let dir_path = Path::new(path);

        if !dir_path.exists() {
            return Err(FileSystemError::NotFound);
        }

        if !dir_path.is_dir() {
            return Err(FileSystemError::InvalidPath);
        }

        fs::remove_dir_all(dir_path)
            .map_err(|e| match e.kind() {
                io::ErrorKind::NotFound => FileSystemError::NotFound,
                io::ErrorKind::PermissionDenied => FileSystemError::PermissionDenied,
                _ => FileSystemError::IOError(e.to_string()),
            })?;

        Ok(FileOperationResult {
            success: true,
            message: "Directory deleted successfully".to_string(),
            path: Some(path.to_string()),
            error_code: None,
        })
    }

    /// Rename a file or directory
    pub fn rename(&self, old_path: &str, new_path: &str) -> Result<FileOperationResult, FileSystemError> {
        let old = Path::new(old_path);
        let new = Path::new(new_path);

        if !old.exists() {
            return Err(FileSystemError::NotFound);
        }

        if new.exists() && !self.config.overwrite {
            return Err(FileSystemError::AlreadyExists);
        }

        fs::rename(old, new)
            .map_err(|e| match e.kind() {
                io::ErrorKind::NotFound => FileSystemError::NotFound,
                io::ErrorKind::PermissionDenied => FileSystemError::PermissionDenied,
                _ => FileSystemError::IOError(e.to_string()),
            })?;

        Ok(FileOperationResult {
            success: true,
            message: "Renamed successfully".to_string(),
            path: Some(new_path.to_string()),
            error_code: None,
        })
    }

    /// Copy a file
    pub fn copy_file(&self, source: &str, destination: &str) -> Result<FileOperationResult, FileSystemError> {
        let src = Path::new(source);
        let dst = Path::new(destination);

        if !src.exists() {
            return Err(FileSystemError::NotFound);
        }

        if !src.is_file() {
            return Err(FileSystemError::InvalidPath);
        }

        if dst.exists() && !self.config.overwrite {
            return Err(FileSystemError::AlreadyExists);
        }

        // Create parent directories if needed
        if let Some(parent) = dst.parent() {
            fs::create_dir_all(parent)
                .map_err(|e| FileSystemError::IOError(e.to_string()))?;
        }

        fs::copy(src, dst)
            .map_err(|e| match e.kind() {
                io::ErrorKind::NotFound => FileSystemError::NotFound,
                io::ErrorKind::PermissionDenied => FileSystemError::PermissionDenied,
                _ => FileSystemError::IOError(e.to_string()),
            })?;

        Ok(FileOperationResult {
            success: true,
            message: "File copied successfully".to_string(),
            path: Some(destination.to_string()),
            error_code: None,
        })
    }

    /// Get file or directory metadata
    pub fn get_metadata(&self, path: &str) -> Result<FileMetadata, FileSystemError> {
        let file_path = Path::new(path);

        if !file_path.exists() {
            return Err(FileSystemError::NotFound);
        }

        let metadata = file_path.metadata()
            .map_err(|e| FileSystemError::IOError(e.to_string()))?;

        let created = metadata.created().ok()
            .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
            .map(|d| d.as_secs());

        let modified = metadata.modified().ok()
            .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
            .map(|d| d.as_secs());

        let accessed = metadata.accessed().ok()
            .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
            .map(|d| d.as_secs());

        let extension = file_path.extension()
            .and_then(|ext| ext.to_str())
            .map(|s| s.to_string());

        Ok(FileMetadata {
            path: path.to_string(),
            name: file_path.file_name()
                .and_then(|name| name.to_str())
                .unwrap_or("")
                .to_string(),
            size: metadata.len(),
            is_directory: metadata.is_dir(),
            is_file: metadata.is_file(),
            is_symlink: metadata.is_symlink(),
            readonly: metadata.permissions().readonly(),
            hidden: self.is_hidden(file_path),
            created,
            modified,
            accessed,
            permissions: format!("{:o}", self.get_permissions(&metadata)),
            extension,
            mime_type: self.get_mime_type(&extension),
        })
    }

    /// List directory contents
    pub fn list_directory(&self, path: &str, include_hidden: bool) -> Result<DirectoryListing, FileSystemError> {
        let dir_path = Path::new(path);

        if !dir_path.exists() {
            return Err(FileSystemError::NotFound);
        }

        if !dir_path.is_dir() {
            return Err(FileSystemError::InvalidPath);
        }

        let entries = fs::read_dir(dir_path)
            .map_err(|e| match e.kind() {
                io::ErrorKind::NotFound => FileSystemError::NotFound,
                io::ErrorKind::PermissionDenied => FileSystemError::PermissionDenied,
                _ => FileSystemError::IOError(e.to_string()),
            })?;

        let mut directory_entries = Vec::new();
        let mut hidden_count = 0;

        for entry in entries {
            let entry = entry.map_err(|e| FileSystemError::IOError(e.to_string()))?;
            let entry_path = entry.path();

            let is_hidden = self.is_hidden(&entry_path);
            if is_hidden {
                hidden_count += 1;
                if !include_hidden {
                    continue;
                }
            }

            let metadata = entry.metadata()
                .map_err(|e| FileSystemError::IOError(e.to_string()))?;

            let name = entry.file_name()
                .to_str()
                .unwrap_or("")
                .to_string();

            let modified = metadata.modified().ok()
                .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
                .map(|d| d.as_secs());

            directory_entries.push(DirectoryEntry {
                name: name.clone(),
                path: entry_path.to_str().unwrap_or("").to_string(),
                is_directory: metadata.is_dir(),
                size: if metadata.is_file() { Some(metadata.len()) } else { None },
                modified,
                permissions: format!("{:o}", self.get_permissions(&metadata)),
                icon: self.get_file_icon(&name, metadata.is_dir()),
            });
        }

        // Sort entries: directories first, then files, alphabetically
        directory_entries.sort_by(|a, b| {
            match (a.is_directory, b.is_directory) {
                (true, false) => std::cmp::Ordering::Less,
                (false, true) => std::cmp::Ordering::Greater,
                _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
            }
        });

        Ok(DirectoryListing {
            path: path.to_string(),
            entries: directory_entries,
            total_count: directory_entries.len(),
            hidden_count,
            error: None,
        })
    }

    /// Check if file is binary
    fn is_binary_file(&self, path: &Path) -> Result<bool, FileSystemError> {
        let mut file = File::open(path)
            .map_err(|e| FileSystemError::IOError(e.to_string()))?;

        let mut buffer = [0; 8192];
        let bytes_read = file.read(&mut buffer)
            .map_err(|e| FileSystemError::IOError(e.to_string()))?;

        // Check for null bytes which typically indicate binary files
        Ok(buffer[..bytes_read].contains(&0))
    }

    /// Check if file/directory is hidden
    fn is_hidden(&self, path: &Path) -> bool {
        path.file_name()
            .and_then(|name| name.to_str())
            .map(|name| name.starts_with('.'))
            .unwrap_or(false)
    }

    /// Get file permissions as octal number
    #[cfg(unix)]
    fn get_permissions(&self, metadata: &fs::Metadata) -> u32 {
        use std::os::unix::fs::PermissionsExt;
        metadata.permissions().mode()
    }

    #[cfg(windows)]
    fn get_permissions(&self, _metadata: &fs::Metadata) -> u32 {
        // Windows doesn't have Unix-style permissions
        0o644
    }

    /// Get MIME type based on file extension
    fn get_mime_type(&self, extension: &Option<String>) -> Option<String> {
        match extension.as_deref() {
            Some("txt") => Some("text/plain".to_string()),
            Some("html") => Some("text/html".to_string()),
            Some("css") => Some("text/css".to_string()),
            Some("js") => Some("application/javascript".to_string()),
            Some("json") => Some("application/json".to_string()),
            Some("xml") => Some("application/xml".to_string()),
            Some("pdf") => Some("application/pdf".to_string()),
            Some("png") => Some("image/png".to_string()),
            Some("jpg") | Some("jpeg") => Some("image/jpeg".to_string()),
            Some("gif") => Some("image/gif".to_string()),
            Some("svg") => Some("image/svg+xml".to_string()),
            Some("mp4") => Some("video/mp4".to_string()),
            Some("mp3") => Some("audio/mpeg".to_string()),
            _ => None,
        }
    }

    /// Get appropriate icon for file type
    fn get_file_icon(&self, name: &str, is_directory: bool) -> String {
        if is_directory {
            return "folder".to_string();
        }

        let extension = Path::new(name)
            .extension()
            .and_then(|ext| ext.to_str())
            .unwrap_or("");

        match extension {
            "rs" => "rust".to_string(),
            "js" | "jsx" => "javascript".to_string(),
            "ts" | "tsx" => "typescript".to_string(),
            "py" => "python".to_string(),
            "html" => "html".to_string(),
            "css" => "css".to_string(),
            "json" => "json".to_string(),
            "md" => "markdown".to_string(),
            "txt" => "text".to_string(),
            "png" | "jpg" | "jpeg" | "gif" | "svg" => "image".to_string(),
            "pdf" => "pdf".to_string(),
            "zip" | "tar" | "gz" => "archive".to_string(),
            _ => "file".to_string(),
        }
    }

    /// Set configuration for file operations
    pub fn set_config(&mut self, config: FileOperationConfig) {
        self.config = config;
    }

    /// Get current configuration
    pub fn get_config(&self) -> &FileOperationConfig {
        &self.config
    }
}

impl Default for FileSystemService {
    fn default() -> Self {
        Self::new()
    }
}
