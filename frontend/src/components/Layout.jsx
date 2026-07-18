import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="layout-main">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
