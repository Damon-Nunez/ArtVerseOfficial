import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Navbar from '../components/navbar';
import { fetchProfileData } from '../utils/api';
import './profile.css';
import { generateWhiteStars } from '../utils/generateWhiteStars';
import { FaInstagram } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState({ name: '', bio: '', profileImage: '', id: '' });
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  // Fetch profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchProfileData();
      if (data) {
        setProfile({
          name: data.name || '',
          bio: data.bio || '',
          profileImage: data.profile_image_url || '',
          id: data.id || '', // Assuming ID is available in profile data
        });
      }
    };

    loadProfile();
  }, []);

  // Handle file input change for profile picture upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  // Upload new profile picture and update profile
  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file); // Make sure this matches the backend field name

    try {
      const response = await axios.post('/api/artists/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!newProfileImage) {
      alert('Please select an image to upload.');
      return;
    }

    try {
      const response = await uploadProfileImage(newProfileImage);

      if (response.success) {
        // After successful upload, update the profile with the new image URL
        const updatedProfile = {
          name: profile.name,
          bio: profile.bio,
          profile_image_url: response.url, // Use 'url' from the response
        };

        // Call the update route to update the profile in the database
        const updateResponse = await fetch(`/api/artists/editArtist?id=${profile.id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedProfile),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (updateResponse.ok) {
          setProfile((prev) => ({
            ...prev,
            profileImage: response.url,
          }));
          setNewProfileImage(null);
          alert('Profile picture updated successfully!');
        } else {
          alert('Failed to update profile.');
        }
      } else {
        alert('Failed to upload profile picture. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('An error occurred while uploading your profile picture.');
    }
  };

  return (
    <div>
      <Navbar />
      <Row>
        <Col sm={12} md={12} lg={12}>
          <div className="profileBlock">
            {generateWhiteStars(230, 'profilePageSeed')} {/* Adjust number of stars as needed */}

            {/* Display Profile Picture */}
            <div className="profileImageWrapper">
              <img
                src={previewImage || profile.profileImage || 'default-profile.png'} // Fallback to default image
                alt="Profile"
                className="profileImage"
              />
              <input type="file" accept="image/*" onChange={handleImageChange} className="profileImageUpload" />
              {newProfileImage && (
                <button onClick={handleUpload} className="uploadButton">
                  Upload
                </button>
              )}
            </div>

            {/* Profile Info */}
            <p className="profileText">{profile.name}</p>
            <p className="profileText">{profile.bio}</p>

            {/* Social Media Icons */}
            <FaInstagram className="profileSocialMedia" />
            <BsTwitterX className="profileSocialMedia" />
            <FaYoutube className="profileSocialMedia" />

            {/* Followers/Following */}
            <div className="profileFollowers">
              <p>Followers:</p>
              <p>Following:</p>
            </div>

            {/* Profile Sections */}
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
