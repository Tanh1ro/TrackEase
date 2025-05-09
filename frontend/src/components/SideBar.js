import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/SideBar.css";
import { useUser } from "../context/UserContext";
import { 
  BiMenu,
  BiX,
  BiGridAlt,
  BiDollarCircle,
  BiGroup,
  BiUser,
  BiCog,
  BiLogOut,
  BiSearch,
  BiTransfer
} from "react-icons/bi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { userData, setUserData } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(() => [
    { icon: <BiGridAlt className="nav-icon" />, name: "Dashboard", path: "/dashboard" },
    { icon: <BiDollarCircle className="nav-icon" />, name: "Expenses", path: "/share-expenses" },
    { icon: <BiGroup className="nav-icon" />, name: "Groups", path: "/groups" },
    { icon: <BiTransfer className="nav-icon" />, name: "Transactions", path: "/transactions" },
    { icon: <BiUser className="nav-icon" />, name: "Profile", path: "/Profile" },
    { icon: <BiCog className="nav-icon" />, name: "Settings", path: "/settings" },
  ], []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle('sidebar-open', !isOpen);
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    // Filter menu items based on search query
    const results = menuItems.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.path.toLowerCase().includes(query)
    );
    setSearchResults(results);
  };

  const handleSearchItemClick = (path) => {
    navigate(path);
    setSearchQuery('');
    setSearchResults([]);
    if (window.innerWidth <= 992) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    setUserData(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          {isOpen && <div className="logo">TrackEase</div>}
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isOpen ? <BiX className="toggle-icon" /> : <BiMenu className="toggle-icon" />}
          </button>
        </div>

        <div className="search-box">
          <BiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchResults.length > 0 && searchQuery && (
            <div className="search-results">
              {searchResults.map((item, index) => (
                <button
                  key={index}
                  className={`search-result-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => handleSearchItemClick(item.path)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <ul className="nav-list">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a 
                href={item.path}
                className={location.pathname === item.path ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleSearchItemClick(item.path);
                }}
              >
                {item.icon}
                {isOpen && <span className="links_name">{item.name}</span>}
              </a>
              {!isOpen && <span className="tooltip">{item.name}</span>}
            </li>
          ))}
        </ul>

        <div className="profile">
          <div className="profile-details">
            {isOpen && (
              <div className="profile-left">
                <img 
                  src={userData?.profileImage || 'profile.jpg'} 
                  alt="profileImg" 
                  className="profile-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'profile.jpg';
                  }}
                />
                <div className="name_job">
                  <div className="name">{userData?.name || 'User'}</div>
                  <div className="job">{userData?.job || 'Member'}</div>
                </div>
              </div>
            )}
            <button 
              className="logout-btn" 
              onClick={() => setShowLogoutConfirm(true)}
              title="Logout"
            >
              <BiLogOut className="logout-icon" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && window.innerWidth <= 992 && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}

      {showLogoutConfirm && (
        <>
          <div className="overlay" onClick={() => setShowLogoutConfirm(false)} />
          <div className="logout-confirmation">
            <div className="logout-confirmation-content">
              <p>Are you sure you want to logout?</p>
              <div className="logout-confirmation-buttons">
                <button className="logout-confirm-btn yes" onClick={handleLogout}>
                  Yes
                </button>
                <button 
                  className="logout-confirm-btn no" 
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;