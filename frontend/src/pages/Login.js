import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/login.css';  // Importing the provided common CSS
import SocialLogin from "../components/SocialLogin";
import InputField from "../components/InputField";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                navigate("/dashboard");
            } else {
                setError(data.error || "Login failed");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
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
                <div className="input-wrapper">
                    <InputField
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                    />
                    <i className="icon mail-icon"></i>  {/* Optional icon for the email field */}
                </div>

                {/* Password Input Field */}
                <div className="input-wrapper">
                    <InputField
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                    />
                    <i className="icon lock-icon"></i>  {/* Optional icon for password field */}
                </div>

                <a href="/forgot-password" className="forgot-password-link">Forgot password?</a>

                <button type="submit" className="login-button">Log In</button> {/* Submit Button */}
            </form>

            <p className="signup-prompt">
                Don&apos;t have an account? <a href="/signup" className="signup-link">Sign up</a>
            </p>
        </div>
    );
};

export default Login;
