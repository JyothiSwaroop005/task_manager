import { FiMenu, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import Avatar from './Avatar';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <button className="icon-btn menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <FiMenu />
      </button>
      <div className="navbar-right">
        <DarkModeToggle />
        <div className="navbar-user">
          <Avatar name={user?.username || '?'} size={36} />
          <span className="navbar-username">{user?.username}</span>
        </div>
        <button className="icon-btn" onClick={logout} title="Logout" aria-label="Logout">
          <FiLogOut />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
