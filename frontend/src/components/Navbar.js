import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../css/Navbar.css';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const { userData } = useUser();
  const handleClick = () => setClick(!click);

  return (
    <div className='header'>
      <div className='container'>
        <h1 className='logo'>Logo</h1>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
          <li>
            <Link to='/contact'>Contact Us</Link>
          </li>
        </ul>
        <div className='btn-group'>
          <Link to='/login'>
            <button className='btn'>Login</button>
          </Link>
        </div>
        <div className='hamburger' onClick={handleClick}>
          {click ? (
            <FaTimes size={18} style={{ color: '#333' }} />
          ) : (
            <FaBars size={18} style={{ color: '#333' }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
