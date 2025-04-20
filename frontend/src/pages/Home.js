/**
 * @file Home.js
 * @description Landing page component for the application
 * @author Nandeesh Kantli
 * @date April 4, 2024
 * @version 1.0.0
 * 
 * This component provides:
 * 1. Application introduction and features
 * 2. Call-to-action buttons
 * 3. User testimonials
 * 4. Feature highlights and benefits
 */

// Home.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // Import Navbar component
import Footer from '../components/Footer'; // Import Footer component
import '../css/home.css';
import { FaChartLine, FaUsers, FaLightbulb, FaShieldAlt, FaMobileAlt, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleScrollToFeatures = (e) => {
    e.preventDefault();
    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTryFree = () => {
    navigate('/signup');
  };

  return (
    <main>
      {/* Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Build better financial habits on a single, collaborative platform</h1>
              <p className="hero-description">
                Join thousands of users who trust TrackEase for their expense tracking and financial management needs.
              </p>
              <div className="hero-cta">
                <button className="btn btn-primary" onClick={handleTryFree}>Try TrackEase Free</button>
                <button className="btn btn-outline" onClick={handleScrollToFeatures}>View Features</button>
              </div>
            </div>
            <div className="hero-image">
              <img 
                src="/images/hero_optimized.svg" 
                alt="TrackEase Dashboard Preview" 
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <h2 className="section-title">Why choose TrackEase?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3>Smart Expense Tracking</h3>
              <p>Automatically categorize and track your expenses with our intelligent system powered by AI.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Team Collaboration</h3>
              <p>Work together seamlessly with your team to manage shared expenses and budgets in real-time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaLightbulb />
              </div>
              <h3>Intelligent Insights</h3>
              <p>Get personalized recommendations and insights to optimize your spending habits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container">
          <h2 className="section-title">About TrackEase</h2>
          <div className="about-content">
            <div className="about-text">
              <p>TrackEase is your all-in-one solution for expense tracking and financial management. We believe in making financial management accessible, collaborative, and insightful for everyone.</p>
              <div className="about-features">
                <div className="about-feature">
                  <div className="about-icon">
                    <FaShieldAlt />
                  </div>
                  <div className="about-feature-content">
                    <h3>Secure & Reliable</h3>
                    <p>Bank-grade security for your financial data with end-to-end encryption and regular backups.</p>
                  </div>
                </div>
                <div className="about-feature">
                  <div className="about-icon">
                    <FaMobileAlt />
                  </div>
                  <div className="about-feature-content">
                    <h3>Cross-Platform</h3>
                    <p>Access your financial data seamlessly across all your devices with real-time synchronization.</p>
                  </div>
                </div>
                <div className="about-feature">
                  <div className="about-icon">
                    <FaClock />
                  </div>
                  <div className="about-feature-content">
                    <h3>Real-Time Updates</h3>
                    <p>Stay on top of your finances with instant notifications and live expense tracking.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="container">
          <h2 className="section-title">Contact Us</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="info-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <h3>Address</h3>
                  <p>RV University</p>
                  <p>RV Vidyanikethan Post</p>
                  <p>8th Mile, Mysuru Road</p>
                  <p>Bengaluru - 560059</p>
                </div>
              </div>
              <div className="info-item">
                <FaPhone className="contact-icon" />
                <div>
                  <h3>Phone</h3>
                  <p>+91 80 4545 1234</p>
                </div>
              </div>
              <div className="info-item">
                <FaEnvelope className="contact-icon" />
                <div>
                  <h3>Email</h3>
                  <p>info@rvu.edu.in</p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h3>Send us a message</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          </div>

          <div className="map-container">
            <h3>Our Location</h3>
            <div className="map-wrapper">
              <iframe
                title="RV University Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.977793317544!2d77.51673731482193!3d12.917800090894392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3fc755555555%3A0x7e19c8f1c1b55f4c!2sRV%20University!5e0!3m2!1sen!2sin!4v1645508123456!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </main>
  );
};

export default Home;
