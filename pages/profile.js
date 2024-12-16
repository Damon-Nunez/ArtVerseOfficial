import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Navbar from '../components/navbar';
import { fetchProfileData } from '../utils/api';
import './profile.css';
import { generateWhiteStars } from '../utils/generateWhiteStars';
import { FaInstagram } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { LuPencilLine } from "react-icons/lu";
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    profileImage: '',
    id: '',
    followers_count: 0,
    following_count: 0,
    instagram: '',
    twitter: '',
    youtube: ''
  });

  const [newProfileImage, setNewProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfileData();
        console.log('Fetched profile data:', data);

        if (data) {
          console.log('Setting profile state with data:', data);
          setProfile({
            name: data.name || '',
            bio: data.bio || '',
            profileImage: data.profile_image_url || '',
            id: data.id || '',
            followers_count: data.followers_count || 0,
            following_count: data.following_count || 0,
            instagram: data.instagram_link || '',
            twitter: data.twitter_link || '',
            youtube: data.youtube_link || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadProfile();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
      setPreviewImage(URL.createObjectURL(file));
      setNewProfileImage(file);
    }
  };

  const handleUpload = async () => {
    if (!newProfileImage) {
      console.error('No image selected.');
      return;
    }
  
    try {
      console.log('Uploading image...');
      const formData = new FormData();
      formData.append('file', newProfileImage);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData
      );
  
      const imageUrl = cloudinaryResponse.data.secure_url;
      console.log('Cloudinary upload successful, image URL:', imageUrl);
  
      await updateProfileImage(imageUrl);
  
      // Manually re-fetch profile data
      const updatedData = await fetchProfileData();
      setProfile({
        ...profile,
        profileImage: updatedData.profile_image_url || '/default-profile.png',
      });
  
      setNewProfileImage(null);
      setPreviewImage('');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  

  const updateProfileImage = async (imageUrl) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      console.log('Updating profile image with URL:', imageUrl);

      const response = await axios.post(
        '/api/artists/editArtist', 
        { profile_image_url: imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Response from profile image update:', response.data);

      if (response.data.success) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profileImage: response.data.profile_image_url,
        }));

        console.log("Profile image updated:", response.data.profile_image_url);

        setSuccessMessage('Profile image uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <Navbar />
      <Row>
        <Col sm={12} md={12} lg={12}>
          <div className="profileBlock">
            {generateWhiteStars(230, 'profilePageSeed')}

            <div className="profileImageWrapper">
              <div className="profileImageContainer">
                <img
                  src={previewImage || profile.profileImage || '/default-profile.png'}
                  alt="Profile"
                  className="profileImage"
                />
                <div
                  className="overlay"
                  onClick={() => document.querySelector('.profileImageUpload').click()}
                >
                  Change Image
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="profileImageUpload"
              />

              {successMessage && (
                <p
                  style={{
                    color: 'green',
                    fontSize: '14px',
                    marginTop: '10px',
                    marginBottom: '15px',
                    fontWeight: 'bold',
                    backgroundColor: '#e6ffe6',
                    padding: '10px',
                    border: '1px solid #d4fdd2',
                    borderRadius: '5px',
                  }}
                >
                  {successMessage}
                </p>
              )}

              {newProfileImage && (
                <button onClick={handleUpload} className="uploadButton">
                  Upload
                </button>
              )}
            </div>

            <div className="profileHeader">
              <p className="profileText"><b>{profile.name}</b></p>
              <LuPencilLine className="editButton" />
            </div>

            <p className="profileBio">{profile.bio}</p>

            <div className="socialMediaIcons">
              {profile.instagram && (
                <a href={profile.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="profileSocialMedia1" />
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
                  <BsTwitterX className="profileSocialMedia2" />
                </a>
              )}
              {profile.youtube && (
                <a href={profile.youtube} target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="profileSocialMedia3" />
                </a>
              )}
            </div>

            <div className="profileFollowers">
              <p>Followers: {profile.followers_count}</p>
              <p>Following: {profile.following_count}</p>
            </div>

            <div className="tabContainer">
              <div
                className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => handleTabClick('posts')}
              >
                Posts
              </div>
              <div
                className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => handleTabClick('favorites')}
              >
                Favorites
              </div>
              <div
                className={`tab ${activeTab === 'bubbles' ? 'active' : ''}`}
                onClick={() => handleTabClick('bubbles')}
              >
                Bubbles
              </div>
            </div>

            <div className="tabContent">
              {activeTab === 'posts' && <div>Showing Posts...</div>}
              {activeTab === 'favorites' && <div>Showing Favorites...</div>}
              {activeTab === 'bubbles' && <div>Showing Bubbles...</div>}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;
