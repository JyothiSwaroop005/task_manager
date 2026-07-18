import { NavLink } from 'react-router-dom';
import { FiGrid, FiCheckSquare, FiUser, FiLock, FiX } from 'react-icons/fi';

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <span className="logo">✅ TaskManager</span>
          <button className="icon-btn sidebar-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="sidebar-link" onClick={onClose}>
            <FiGrid /> Dashboard
          </NavLink>
          <NavLink to="/tasks" className="sidebar-link" onClick={onClose}>
            <FiCheckSquare /> Tasks
          </NavLink>
          <NavLink to="/profile" className="sidebar-link" onClick={onClose}>
            <FiUser /> Profile
          </NavLink>
          <NavLink to="/change-password" className="sidebar-link" onClick={onClose}>
            <FiLock /> Change Password
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
