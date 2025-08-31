import './Header.css';

export const Header = () => {
  return (
    <header className="ide-header">
      <div className="header-left">
        <span className="app-title">CodeForge</span>
      </div>
      <div className="header-center">
        <div className="menu-bar">
          <span className="menu-item">File</span>
          <span className="menu-item">Edit</span>
          <span className="menu-item">View</span>
          <span className="menu-item">Go</span>
          <span className="menu-item">Run</span>
          <span className="menu-item">Terminal</span>
          <span className="menu-item">Help</span>
        </div>
      </div>
      <div className="header-right">
        <div className="window-controls">
          <button className="control-btn minimize">−</button>
          <button className="control-btn maximize">□</button>
          <button className="control-btn close">×</button>
        </div>
      </div>
    </header>
  );
};