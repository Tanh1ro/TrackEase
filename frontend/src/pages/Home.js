
// Home.jsx
import React from 'react';
import Navbar from '../components/Navbar'; // Import Navbar component
import Footer from '../components/Footer'; // Import Footer component
import '../css/home.css';
import heroImage from '../css/images/hero.svg'

const Home = () => {
  return (
    <main>
      {/* Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="row container">
          <div className="column">
            <h2>Top free tool and extension to <br /> rapidly grow your business</h2>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis, architecto? Consectetur enim obcaecati velit quibusdam iure, perspiciatis accusantium, voluptatibus possimus cum voluptates dolorum optio ab vitae. Praesentium voluptas quia voluptates at aperiam aliquid vitae autem!
            </p>
            <div className="buttons">
              <button className="btn">Read More</button>
              <button className="btn">Contact Us</button>
            </div>
          </div>
          <div className="column">
            <img src={heroImage} alt="heroImg" className="hero_img" />
          </div>
        </div>
        <img src="images/bg-bottom-hero.png" alt="" className="curveImg" />
      </section>
      {/* Hero Section End */}

      {/* Footer Component */}
      <Footer />
    </main>
  );
};

export default Home;
