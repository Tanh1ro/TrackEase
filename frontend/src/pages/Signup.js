import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/login.css';  // Importing the provided common CSS

const Signup = () => {
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const userData = {  
            emailOrPhone: emailOrPhone,  
            password: password,  
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/signup/", {  
                method: "POST",  
                headers: { "Content-Type": "application/json" },  
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/dashboard");
            } else {
                setError(data.error || "Signup failed. Please try again.");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <h2 className="form-title">Sign up</h2>

            {error && <p className="error-message">{error}</p>} {/* Error message */}

            <form onSubmit={handleSignup} className="login-form">
                {/* Email or Phone Input Field */}
                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Email address or Phone number"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        className="input-field"
                        required
                    />
                    <i className="icon email-phone-icon"></i>  {/* Optional icon for input */}
                </div>

                {/* Password Input Field */}
                <div className="input-wrapper">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        required
                    />
                    <i className="icon lock-icon"></i>  {/* Optional icon for password */}
                </div>

                {/* Confirm Password Input Field */}
                <div className="input-wrapper">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field"
                        required
                    />
                    <i className="icon lock-icon"></i>  {/* Optional icon for confirm password */}
                </div>

                <button type="submit" className="login-button">Sign Up</button> {/* Submit Button */}
            </form>

            <p className="signup-prompt">
                Already have an account? <a href="/login" className="signup-link">Log in</a>
            </p>
        </div>
    );
};

export default Signup;
