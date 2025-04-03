import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/login.css';  // Importing the provided common CSS
import SocialLogin from "../components/SocialLogin";
import InputField from "../components/InputField";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email) {
            setError("Email is required");
            return false;
        }
        if (!password) {
            setError("Password is required");
            return false;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return false;
        }
        return true;
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    username: email,
                    password: password 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store authentication token
                localStorage.setItem("token", data.token);
                
                // Fetch user profile data
                const profileResponse = await fetch("http://localhost:8000/api/profile/", {
                    headers: {
                        "Authorization": `Token ${data.token}`
                    }
                });
                
                const profileData = await profileResponse.json();
                
                if (profileResponse.ok) {
                    // Store user profile data
                    localStorage.setItem("userProfile", JSON.stringify(profileData));
                    navigate("/dashboard");
                } else {
                    setError("Failed to fetch user profile");
                }
            } else {
                setError(data.error || "Invalid email or password");
            }
        } catch (error) {
            setError("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2 className="form-title">Log in with</h2>
            <SocialLogin />
            <p className="separator"><span>or</span></p>

            {error && <p className="error-message">{error}</p>}  {/* Display error message */}

            <form onSubmit={handleLogin} className="login-form">
                {/* Email Input Field */}
                <InputField
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    disabled={isLoading}
                    icon="mail"
                />

                {/* Password Input Field */}
                <InputField
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    disabled={isLoading}
                    icon="lock"
                    rightIcon={showPassword ? "visibility" : "visibility_off"}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                />

                <a href="/forgot-password" className="forgot-password-link">Forgot password?</a>

                <button 
                    type="submit" 
                    className={`login-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Log In'}
                </button> {/* Submit Button */}
            </form>

            <p className="signup-prompt">
                Don&apos;t have an account? <a href="/signup" className="signup-link">Sign up</a>
            </p>
        </div>
    );
};

export default Login;
