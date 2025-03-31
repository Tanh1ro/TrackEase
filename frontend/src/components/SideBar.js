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
  BiMoon
} from "react-icons/bi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
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
    // Clear user data
    setUserData(null);
    // Navigate to login page
    navigate('/login');
  };

  return (
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
          <a href=" /dashboard">
            <BiGridAlt className="nav-icon" />
            <span className="links_name">Dashboard</span>
          </a>
          <span className="tooltip">Dashboard</span>
        </li>
        <li>
          <a href="#">
            <BiDollarCircle className="nav-icon" />
            <span className="links_name">Share Expenses</span>
          </a>
          <span className="tooltip">Share Expenses</span>
        </li>
        <li>
          <a href="#">
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
            <img src="profile.jpg" alt="profileImg" className="profile-img" />
            <div className="name_job">
              <div className="name">{userData.name}</div>
              <div className="job">{userData.job}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <BiLogOut className="logout-icon" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;