import React from 'react';
import '../css/UserPage.css';
import { useUser } from '../context/UserContext';

const UserPage = () => {
  const { userData } = useUser();

  return (
    <div className="user-page">
      <div className="user-profile">
        <div className="profile-header">
          <img src="profile.jpg" alt="profileImg" className="profile-img-large" />
          <h1>{userData.name}</h1>
          <p className="job-title">{userData.job}</p>
        </div>
        
        <div className="profile-details">
          <div className="detail-item">
            <label>Email</label>
            <p>{userData.email}</p>
          </div>
          <div className="detail-item">
            <label>Phone</label>
            <p>{userData.phone}</p>
          </div>
          <div className="detail-item">
            <label>Join Date</label>
            <p>{userData.joinDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage; 