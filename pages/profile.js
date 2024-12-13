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
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  // State to track the active tab
  const [activeTab, setActiveTab] = useState('posts'); 

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfileData();
        console.log('Fetched profile data:', data); // Log the profile data for debugging

        if (data) {
          setProfile({
            name: data.name || '',
            bio: data.bio || '',
            profileImage: data.profile_image_url || '',  // Make sure profile_image_url is set correctly
            id: data.id || '',
            followers_count: data.followers_count,
            following_count: data.following_count
          });
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };
  
    loadProfile();
  }, []);

  // Handle image selection and preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));  // Preview image before upload
      setNewProfileImage(file);  // Store the selected file
    }
  };

  // Handle profile image upload and update the artist
  const handleUpload = async () => {
    if (!newProfileImage) {
      console.error('No image selected.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', newProfileImage);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET); // Ensure preset is set correctly

      // Upload the image to Cloudinary
      const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
      
      // Get the uploaded image URL from Cloudinary
      const imageUrl = cloudinaryResponse.data.secure_url;
      console.log('Cloudinary upload successful, image URL:', imageUrl);  // Log the Cloudinary image URL

      // Now, update the profile image URL in the database using the editArtist route
      await updateProfileImage(imageUrl);

      // Clear the newProfileImage state and hide the button
      setNewProfileImage(null);
      setPreviewImage(''); // Optionally reset the preview

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const updateProfileImage = async (imageUrl) => {
    try {
      // Get the JWT token from localStorage using the correct key
      const token = localStorage.getItem('authToken'); // Use 'authToken' instead of 'token'
  
      if (!token) {
        throw new Error('No token found');
      }
  
      const response = await axios.post(
        '/api/artists/editArtist', // This is the route for editing the artist's profile
        { profile_image_url: imageUrl }, // Send the image URL in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
  
      if (response.data.success) {
        // Update the profile data after successful upload
        console.log('Profile image updated successfully:', response.data.profile_image_url);
  
        setProfile((prevProfile) => ({
          ...prevProfile,
          profileImage: response.data.profile_image_url,
        }));
  
        // Set success message to inform the user
        setSuccessMessage('Profile image uploaded successfully!');
        
        // Clear the message after a few seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000); // Message disappears after 3 seconds
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  // Handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab); // Set active tab when clicked
  };

  return (
    <div>
      <Navbar />
      <Row>
        <Col sm={12} md={12} lg={12}>
          <div className="profileBlock">
            {generateWhiteStars(230, 'profilePageSeed')} {/* Adjust number of stars as needed */}

            <div className="profileImageWrapper">
              <div className="profileImageContainer">
                {/* Profile Image */}
                <img
                  src={previewImage || profile.profileImage || '/default-profile.png'} // Preview or fallback image
                  alt="Profile"
                  className="profileImage"
                />

                {/* Hover Overlay */}
                <div
                  className="overlay"
                  onClick={() => document.querySelector('.profileImageUpload').click()}
                >
                  Change Image
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="profileImageUpload"
              />

              {/* Success Message */}
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

              {/* Upload Button */}
              {newProfileImage && (
                <button onClick={handleUpload} className="uploadButton">
                  Upload
                </button>
              )}
            </div>

            {/* Profile Info */}
            <p className="profileText"><b>{profile.name}</b></p>
            <p className="profileBio">{profile.bio}</p>

            {/* Social Media Icons */}
            <FaInstagram className="profileSocialMedia" />
            <BsTwitterX className="profileSocialMedia" />
            <FaYoutube className="profileSocialMedia" />

            {/* Followers/Following */}
            <div className="profileFollowers">
              <p>Followers: {profile.followers_count}</p>
              <p>Following: {profile.following_count}</p>
            </div>

            {/* Profile Sections (Tabs) */}
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

            {/* Dynamic Content */}
            <div className="tabContent">
              {activeTab === 'posts' && <div>Showing Posts...</div>}
              {activeTab === 'favorites' && <div>Showing Favorites...</div>}
              {activeTab === 'bubbles' && <div>Showing Bubbles...</div>}
            </div>
          </div>
        </Col>
        <Col>
        <p
        style={{
          display:"flex",
          justifyContent:"center"
        }}
        > this is where the posts and shit will be</p>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;
