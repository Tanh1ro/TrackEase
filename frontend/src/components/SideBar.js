import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SideBar.css";
import { useUser } from "../context/UserContext";
import { 
  BiMenu, 
  BiMenuAltRight, 
  BiSearch, 
  BiGridAlt, 
  BiUser, 
  BiChat, 
  BiPieChartAlt2, 
  BiFolder, 
  BiCartAlt, 
  BiHeart, 
  BiCog, 
  BiLogOut,
  BiDollarCircle,
  BiCodeAlt,
  BiGroup,
  BiSun,
  BiMoon,
  BiUserCircle
} from "react-icons/bi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { userData, setUserData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    // Clear user data from context
    setUserData(null);
    
    // Clear any stored session data from localStorage
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    
    // Navigate to home page
    navigate('/');
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    handleLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo-details">
          <BiCodeAlt className="icon" />
          <div className="logo_name">SplitIt</div>
          <div className="toggle-btn" onClick={toggleSidebar}>
            {isOpen ? <BiMenuAltRight className="toggle-icon" /> : <BiMenu className="toggle-icon" />}
          </div>
        </div>
        <ul className="nav-list">
          {isOpen && (
            <li className="search-box">
              <BiSearch className="search-icon" />
              <input type="text" placeholder="Search..." />
              <span className="tooltip">Search</span>
            </li>
          )}
          <li>
            <a href="/dashboard">
              <BiGridAlt className="nav-icon" />
              <span className="links_name">Dashboard</span>
            </a>
            <span className="tooltip">Dashboard</span>
          </li>
          <li>
            <a href="/share-expenses">
              <BiDollarCircle className="nav-icon" />
              <span className="links_name">Share Expenses</span>
            </a>
            <span className="tooltip">Share Expenses</span>
          </li>
          <li>
            <a href="/groups">
              <BiGroup className="nav-icon" />
              <span className="links_name">My Groups</span>
            </a>
            <span className="tooltip">My Groups</span>
          </li>
          <li>
            <a href="/user">
              <BiUser className="nav-icon" />
              <span className="links_name">User</span>
            </a>
            <span className="tooltip">User</span>
          </li> 
          {/* <li>
            <a href="#">
              <BiPieChartAlt2 className="nav-icon" />
              <span className="links_name">Analytics</span>
            </a>
            <span className="tooltip">Analytics</span>
          </li>
           */}
          {/* <li>
            <a href="#">
              <BiCartAlt className="nav-icon" />
              <span className="links_name">Order</span>
            </a>
            <span className="tooltip">Order</span>
          </li> */}
          {/* <li>
            <a href="#">
              <BiHeart className="nav-icon" />
              <span className="links_name">Saved</span>
            </a>
            <span className="tooltip">Saved</span>
          </li> */}
          <li>
            <a href="#" onClick={toggleTheme}>
              {theme === 'dark' ? <BiSun className="nav-icon" /> : <BiMoon className="nav-icon" />}
              <span className="links_name">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </a>
            <span className="tooltip">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </li>
          <li>
            <a href="#">
              <BiCog className="nav-icon" />
              <span className="links_name">Setting</span>
            </a>
            <span className="tooltip">Setting</span>
          </li>
          <li className="profile">
            <div className="profile-details">
              <img 
                src={userData?.profileImage || 'profile.jpg'} 
                alt="profileImg" 
                className="profile-img"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = 'profile.jpg';
                }}
              />
              <div className="name_job">
                <div className="name">{userData?.name}</div>
                <div className="job">{userData?.job}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogoutClick}>
              <BiLogOut className="logout-icon" />
            </button>
          </li>
        </ul>
      </div>

      {showLogoutConfirm && (
        <>
          <div className="overlay" onClick={handleCancelLogout} />
          <div className="logout-confirmation">
            <p>Are you sure you want to logout?</p>
            <div className="logout-confirmation-buttons">
              <button className="logout-confirm-btn yes" onClick={handleConfirmLogout}>
                Yes
              </button>
              <button className="logout-confirm-btn no" onClick={handleCancelLogout}>
                No
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;