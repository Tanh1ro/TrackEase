import React, { useState, useEffect } from 'react';
import '../css/UserPage.css';
import { useUser } from '../context/UserContext';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const { userData, setUserData } = useUser();
  const userEmail = userData.email;
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    phone: userData?.phone || '',
    foodType: userData?.foodType || 'vegetarian',
    profileImage: null,
    firstName: userData?.first_name || '',
    lastName: userData?.last_name || ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(
    userData?.profile_image ? `http://localhost:8000${userData.profile_image}` : 'profile.jpg'
  );
  const navigate = useNavigate();

  // Update formData when userData changes
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        phone: userData.phone || '',
        foodType: userData.foodType || 'vegetarian',
        firstName: userData.first_name || '',
        lastName: userData.last_name || ''
      }));
      setImagePreview(
        userData.profile_image ? `http://localhost:8000${userData.profile_image}` : 'profile.jpg'
      );
    }
  }, [userData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.currentPassword && formData.newPassword) {
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters long';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (formData.phone) {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          profileImage: 'Image size should be less than 5MB'
        }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      
      if (formData.currentPassword && formData.newPassword) {
        formDataToSend.append('currentPassword', formData.currentPassword);
        formDataToSend.append('newPassword', formData.newPassword);
      }
      
      if (formData.phone !== userData?.phone) {
        formDataToSend.append('phone', formData.phone);
      }
      
      if (formData.foodType !== userData?.foodType) {
        formDataToSend.append('foodType', formData.foodType);
      }
      
      if (formData.firstName !== userData?.first_name) {
        formDataToSend.append('first_name', formData.firstName);
      }
      
      if (formData.lastName !== userData?.last_name) {
        formDataToSend.append('last_name', formData.lastName);
      }
      
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      // Log the FormData contents for debugging
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await api.put('/profile/update/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        // Update the userData in context with the new data
        setUserData(response.data);
        setSuccessMessage('Profile updated successfully!');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || 'Failed to update profile. Please try again.'
      }));
    }
  };

  const validateUserData = async (email, password) => {
    try {
        // First, try to login to validate credentials
        const loginResponse = await fetch("http://localhost:8000/api/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                username: email,
                password: password 
            }),
        });

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
            return {
                isValid: false,
                error: loginData.error || "Invalid credentials"
            };
        }

        // If login successful, get user profile data
        const profileResponse = await fetch("http://localhost:8000/api/profile/", {
            headers: {
                "Authorization": `Token ${loginData.token}`
            }
        });

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
            return {
                isValid: false,
                error: "Failed to fetch user profile"
            };
        }

        // Return validated user data
        return {
            isValid: true,
            userData: profileData,
            token: loginData.token
        };

    } catch (error) {
        return {
            isValid: false,
            error: "An error occurred while validating user data"
        };
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await validateUserData(userEmail, formData.currentPassword);
    if (result.isValid) {
        // Store token and user data
        localStorage.setItem("token", result.token);
        localStorage.setItem("userProfile", JSON.stringify(result.userData));
        // Navigate to dashboard or home page
        navigate("/dashboard");
    } else {
        // Show error message
        setErrors(prev => ({
            ...prev,
            login: result.error
        }));
    }
  };

  const checkUserExists = async (email) => {
    try {
        const response = await fetch("http://localhost:8000/api/signup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                username: email,
                password: "dummy_password" // This will be rejected if user exists
            })
        });

        const data = await response.json();
        return response.ok;
    } catch (error) {
        console.error("Error checking user:", error);
        return false;
    }
  };

  return (
    <section className="home-section">
      <div className="text">User Profile</div>
      <div className="dashboard-content">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="profile-header">
                  <div className="profile-image-container">
                    <img 
                      src={imagePreview} 
                      alt="profileImg" 
                      className="profile-img-large"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = 'profile.jpg';
                      }}
                    />
                    <label className="image-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="image-upload-input"
                      />
                      Change Photo
                    </label>
                  </div>
                  <h1>{userData?.name}</h1>
                  <p className="job-title">{userData?.job}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="profile-form">
                  {successMessage && (
                    <div className="success-message">{successMessage}</div>
                  )}
                  
                  {errors.submit && (
                    <div className="error-message">{errors.submit}</div>
                  )}

                  <div className="form-section">
                    <h3>Personal Information</h3>
                    <div className="detail-item">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                    <div className="detail-item">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Change Password</h3>
                    <div className="detail-item">
                      <label>Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                    <div className="detail-item">
                      <label>New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                      {errors.newPassword && (
                        <span className="error-text">{errors.newPassword}</span>
                      )}
                    </div>
                    <div className="detail-item">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                      {errors.confirmPassword && (
                        <span className="error-text">{errors.confirmPassword}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Contact Information</h3>
                    <div className="detail-item">
                      <label>Email</label>
                      <p>{userEmail}</p>
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                      {errors.phone && (
                        <span className="error-text">{errors.phone}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Preferences</h3>
                    <div className="detail-item">
                      <label>Food Type</label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="foodType"
                            value="vegetarian"
                            checked={formData.foodType === 'vegetarian'}
                            onChange={handleInputChange}
                          />
                          Vegetarian
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="foodType"
                            value="non-vegetarian"
                            checked={formData.foodType === 'non-vegetarian'}
                            onChange={handleInputChange}
                          />
                          Non-Vegetarian
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="detail-item">
                    <label>Join Date</label>
                    <p>{userData?.joinDate}</p>
                  </div>

                  <button type="submit" className="update-button">
                    Update Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPage; 