import { Header } from './Header.tsx';
import { Sidebar } from './Sidebar.tsx';
import { MainArea } from './MainArea.tsx';
import { StatusBar } from './StatusBar.tsx';
import './IDELayout.css';

export const IDELayout = () => {
  return (
    <div className="ide-layout">
      <Header />
      <div className="ide-body">
        <Sidebar />
        <MainArea />
      </div>
      <StatusBar />
    </div>
  );
};