import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/login.css';  // Importing the provided common CSS
import SocialLogin from "../components/SocialLogin";
import InputField from "../components/InputField";

const Signup = () => {
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                    console.log("Token received, storing in localStorage");
                    localStorage.setItem("token", data.token);
                    // Add a small delay to ensure token is stored
                    setTimeout(() => {
                        console.log("Navigating to dashboard");
                        navigate("/dashboard");
                    }, 100);
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

    const handleGoogleLogin = async () => {
        try {
            // Initialize Google Sign-In
            const googleAuth = await window.gapi.auth2.getAuthInstance();
            const googleUser = await googleAuth.signIn();
            const profile = googleUser.getBasicProfile();
            
            // Get user data from Google
            const userData = {
                username: profile.getEmail(),
                email: profile.getEmail(),
                name: profile.getName(),
                profileImage: profile.getImageUrl(),
                googleId: profile.getId()
            };

            // Send to backend for authentication
            const response = await fetch("http://localhost:8000/api/social-auth/google/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userProfile", JSON.stringify(data.user));
                navigate("/dashboard");
            } else {
                setError(data.error || "Google login failed");
            }
        } catch (error) {
            console.error("Google login error:", error);
            setError("Failed to login with Google");
        }
    };

    const handleAppleLogin = async () => {
        try {
            // Initialize Apple Sign-In
            const response = await window.AppleID.auth.signIn();
            
            // Send to backend for authentication
            const authResponse = await fetch("http://localhost:8000/api/social-auth/apple/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(response)
            });

            const data = await authResponse.json();

            if (authResponse.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userProfile", JSON.stringify(data.user));
                navigate("/dashboard");
            } else {
                setError(data.error || "Apple login failed");
            }
        } catch (error) {
            console.error("Apple login error:", error);
            setError("Failed to login with Apple");
        }
    };

    return (
        <div className="login-container">
            <h2 className="form-title">Sign up with</h2>
            <SocialLogin onGoogleLogin={handleGoogleLogin} onAppleLogin={handleAppleLogin} />
            <p className="separator"><span>or</span></p>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSignup} className="login-form">
                {/* Email or Phone Input Field */}
                <div className="input-wrapper">
                    <InputField
                        type="text"
                        placeholder="Email address or Phone number"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        className="input-field"
                        disabled={isLoading}
                        icon="mail"
                    />
                </div>

                {/* Password Input Field */}
                <div className="input-wrapper">
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
                </div>

                {/* Confirm Password Input Field */}
                <div className="input-wrapper">
                    <InputField
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field"
                        disabled={isLoading}
                        icon="lock"
                        rightIcon={showConfirmPassword ? "visibility" : "visibility_off"}
                        onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                </div>

                <button 
                    type="submit" 
                    className="login-button"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing up..." : "Sign Up"}
                </button>
            </form>

            <p className="signup-prompt">
                Already have an account? <a href="/login" className="signup-link">Log in</a>
            </p>
        </div>
    );
};

export default Signup;
