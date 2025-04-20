import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../css/Navbar.css';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const { colors } = useTheme();
  const location = useLocation();
  const handleClick = () => setClick(!click);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      window.location.href = `/#${targetId}`;
      return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setClick(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className='header'>
      <div className='container'>
        <Link to="/" className='logo'>
          TrackEase
        </Link>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li>
            <Link to='/' className={isActive('/')}>Home</Link>
          </li>
          <li>
            <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className={location.hash === '#about' ? 'active' : ''}>
              About
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className={location.hash === '#contact' ? 'active' : ''}>
              Contact Us
            </a>
          </li>
        </ul>
        <div className='btn-group'>
          <Link to='/login'>
            <button className='btn btn-primary'>Login</button>
          </Link>
        </div>
        <div className='hamburger' onClick={handleClick}>
          {click ? (
            <FaTimes size={20} style={{ color: colors.text }} />
          ) : (
            <FaBars size={20} style={{ color: colors.text }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
