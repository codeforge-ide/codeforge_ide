import { useState } from 'react';
import './MainArea.css';

export const MainArea = () => {
  const [tabs] = useState([
    { id: 1, name: 'Welcome.md', content: '# Welcome to CodeForge\n\nYour modern code editor.', active: true },
  ]);

  return (
    <main className="ide-main-area">
      <div className="tab-bar">
        {tabs.map(tab => (
          <div key={tab.id} className={`tab ${tab.active ? 'active' : ''}`}>
            <span className="tab-name">{tab.name}</span>
            <button className="tab-close">×</button>
          </div>
        ))}
      </div>
      <div className="editor-container">
        {tabs.find(tab => tab.active) && (
          <div className="editor">
            <pre className="editor-content">
              {tabs.find(tab => tab.active)?.content}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
};