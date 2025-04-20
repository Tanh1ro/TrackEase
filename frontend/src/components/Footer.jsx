import React from 'react';
import '../css/footer.css';
import { Link } from "react-router-dom";
import { logo } from "../assets";
import { footerLinks, socialMedia } from "../constants";

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-brand">
        <img
          src={logo}
          alt="TrackEase"
          className="footer-logo"
        />
        <p className="footer-description">
          TrackEase - Your ultimate expense tracking and management solution.
        </p>
        <div className="social-links">
          {socialMedia.map((social, index) => (
            <a
              key={social.id}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <img
                src={social.icon}
                alt={social.id}
                className="social-icon"
              />
            </a>
          ))}
        </div>
      </div>

      <div className="footer-links-container">
        {footerLinks.map((footerlink) => (
          <div key={footerlink.title} className="footer-links-group">
            <h4 className="footer-links-title">{footerlink.title}</h4>
            <ul className="footer-links-list">
              {footerlink.links.map((link, index) => (
                <li key={link.name} className="footer-link-item">
                  <Link to={link.link} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="footer-bottom">
      <p className="copyright">
        © {new Date().getFullYear()} TrackEase. All rights reserved.
      </p>
      <div className="footer-legal">
        <Link to="/privacy" className="legal-link">Privacy Policy</Link>
        <Link to="/terms" className="legal-link">Terms of Service</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
