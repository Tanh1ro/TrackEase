import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/login.css';  // Importing the provided common CSS

const Signup = () => {
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!emailOrPhone || !password || !confirmPassword) {
            setError("All fields are required.");
            return false;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return false;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return false;
        }
        return true;
    };

    const handleSignup = async (event) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        const userData = {
            username: emailOrPhone,
            password: password,
        };

        try {
            console.log("Attempting signup with:", { ...userData, password: "***" });
            const response = await fetch("http://127.0.0.1:8000/api/signup/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            console.log("Signup response:", { ...data, token: data.token ? "***" : null });

            if (response.ok) {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    navigate("/dashboard");
                } else {
                    setError("Signup successful but no token received.");
                }
            } else {
                setError(data.error || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            setError("Network error. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                    />
                    <i className="icon lock-icon"></i>  {/* Optional icon for confirm password */}
                </div>

                <button 
                    type="submit" 
                    className="login-button"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing up..." : "Sign Up"}
                </button> {/* Submit Button */}
            </form>

            <p className="signup-prompt">
                Already have an account? <a href="/login" className="signup-link">Log in</a>
            </p>
        </div>
    );
};

export default Signup;
