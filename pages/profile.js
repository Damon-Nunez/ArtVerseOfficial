import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Navbar from '../components/navbar';
import { fetchProfileData } from '../utils/api';
import './profile.css';
import { generateWhiteStars } from '../utils/generateWhiteStars';
import { FaInstagram } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { CldUploadWidget } from 'next-cloudinary';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState({ name: '', bio: '', profileImage: '', id: '' });
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

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

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const updateProfileImage = async (imageUrl) => {
    try {
      // Get the JWT token from localStorage using the correct key
      const token = localStorage.getItem('authToken');  // Use 'authToken' instead of 'token'
  
      if (!token) {
        throw new Error('No token found');
      }
  
      const response = await axios.post(
        '/api/artists/editArtist',  // This is the route for editing the artist's profile
        { profile_image_url: imageUrl },  // Send the image URL in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
          },
        }
      );
  
      if (response.data.success) {
        // Optionally, update the profile data after successful upload
        console.log('Profile image updated successfully:', response.data.profile_image_url);
        setProfile(prevProfile => ({
          ...prevProfile,
          profileImage: response.data.profile_image_url,
        }));
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
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
                src={profile.profileImage ? profile.profileImage : '/default-profile.png'}  // Fallback to default image if profileImage is not available
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
