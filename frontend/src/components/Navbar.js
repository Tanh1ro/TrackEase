import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../css/Navbar.css';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  return (
    <div className='header'>
      <div className='container'>
        <h1 className='logo'>Logo</h1>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li>
            <Link to='/'>Home</Link> {/* Use Link instead of anchor tag */}
          </li>
          <li>
            <Link to='/about'>About Us</Link> {/* Example link for "Featured" */}
          </li>
          <li>
            <Link to='/earn'>Earn</Link> {/* Example link for "Earn" */}
          </li>
          <li>
            <Link to='/contact'>Contact</Link> {/* Example link for "Contact" */}
          </li>
        </ul>
        <div className='btn-group'>
          <Link to='/login'>
            <button className='btn'>Login</button> {/* Wrap login button with Link */}
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
