import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { CgProfile } from "react-icons/cg";
import { GrEmptyCircle } from "react-icons/gr";
import Navbar from '../components/Navbar';
import { fetchProfileData } from '../utils/api';
import './Profile.css';
import { generateWhiteStars } from '../utils/generateWhiteStars';

function Profile() {
  const [profile, setProfile] = useState({ name: '', bio: '' });

  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchProfileData();
      if (data) {
        setProfile({
          name: data.name || '',
          bio: data.bio || '',
        });
      }
    };

    loadProfile();
  }, []);

  return (
    <div>
      <Navbar />
      <Row>
        <Col sm={12} md={12} lg={12}>
          <div className="profileBlock">
            {generateWhiteStars(230)} {/* Adjust number of stars as needed */}
            <CgProfile className="profileItems" />
            <p className="profileText">{profile.name}</p>
            <p className="profileText">{profile.bio}</p>
            <GrEmptyCircle className="profileSocialMedia" />
            <GrEmptyCircle className="profileSocialMedia" />
            <GrEmptyCircle className="profileSocialMedia" />
            <div className="profileFollowers">
              <p>Followers</p>
              <p>Following</p>
            </div>
            <div className="PFB">
              <p className="PFBText">Posts</p>
              <p className="PFBText">Favorites</p>
              <p className="PFBText">Bubbles</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;
