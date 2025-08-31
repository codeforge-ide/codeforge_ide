import { useState } from 'react';
import './Sidebar.css';

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('explorer');

  return (
    <aside className="ide-sidebar">
      <div className="sidebar-tabs">
        <button 
          className={`sidebar-tab ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}
          title="Explorer"
        >
          📁
        </button>
        <button 
          className={`sidebar-tab ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
          title="Search"
        >
          🔍
        </button>
        <button 
          className={`sidebar-tab ${activeTab === 'git' ? 'active' : ''}`}
          onClick={() => setActiveTab('git')}
          title="Source Control"
        >
          🔀
        </button>
        <button 
          className={`sidebar-tab ${activeTab === 'extensions' ? 'active' : ''}`}
          onClick={() => setActiveTab('extensions')}
          title="Extensions"
        >
          🧩
        </button>
      </div>
      <div className="sidebar-content">
        {activeTab === 'explorer' && (
          <div className="explorer-panel">
            <div className="panel-header">
              <h3>Explorer</h3>
              <div className="panel-actions">
                <button title="New File">📄</button>
                <button title="New Folder">📁</button>
                <button title="Refresh">🔄</button>
              </div>
            </div>
            <div className="file-tree">
              <div className="file-item">📁 src</div>
              <div className="file-item">📄 package.json</div>
              <div className="file-item">📄 README.md</div>
            </div>
          </div>
        )}
        {activeTab === 'search' && (
          <div className="search-panel">
            <div className="panel-header">
              <h3>Search</h3>
            </div>
            <div className="search-input-container">
              <input type="text" placeholder="Search..." className="search-input" />
            </div>
          </div>
        )}
        {activeTab === 'git' && (
          <div className="git-panel">
            <div className="panel-header">
              <h3>Source Control</h3>
            </div>
            <div className="git-content">
              <p>Git integration coming soon...</p>
            </div>
          </div>
        )}
        {activeTab === 'extensions' && (
          <div className="extensions-panel">
            <div className="panel-header">
              <h3>Extensions</h3>
            </div>
            <div className="extensions-content">
              <p>Extensions system coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};