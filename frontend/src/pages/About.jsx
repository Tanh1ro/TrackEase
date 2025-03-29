import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import '../css/home.css';

const About = () => {
    return (
        <>
            <Navbar />
            <main>
                <section className="hero">
                    <div className="row container">
                        <div className="column">
                            <h2>Top free tools to rapidly grow your business</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates, optio.</p>
                            <div className="buttons">
                                <button className="btn">Read More</button>
                                <button className="btn">Contact Us</button>
                            </div>
                        </div>
                        <div className="column">
                            <img src="/images/hero.png" alt="Hero" className="hero_img" />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default About;
