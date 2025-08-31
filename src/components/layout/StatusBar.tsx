import './StatusBar.css';

export const StatusBar = () => {
  return (
    <footer className="ide-status-bar">
      <div className="status-left">
        <span className="status-item">🔀 main</span>
        <span className="status-item">✓ No Issues</span>
      </div>
      <div className="status-center">
        <span className="status-item">Ready</span>
      </div>
      <div className="status-right">
        <span className="status-item">TypeScript</span>
        <span className="status-item">UTF-8</span>
        <span className="status-item">LF</span>
        <span className="status-item">Ln 1, Col 1</span>
      </div>
    </footer>
  );
};