import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import { fetchProfileData } from '../utils/api';
import './profile.css';
import { generateWhiteStars } from '../utils/generateWhiteStars';
import { FaInstagram } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { LuPencilLine } from "react-icons/lu";
import axios from 'axios';
import EditProfileModal from '../utils/editProfileModule';
import 'bootstrap/dist/css/bootstrap.min.css';


function Profile() {
  // A UseState Code that will later be used to fetch the data of our user. It remains blank until our other code triggers its activation and fills
  // in the data from the back-end DataBase.
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

  // Many useState codes that also remain null or empty until another code triggers its activation and fill itself with something.
  const [newProfileImage, setNewProfileImage] = useState(null); //State that controls the profile picture
  const [previewImage, setPreviewImage] = useState(''); // State that controls what you see before uploading the profile picture
  const [successMessage, setSuccessMessage] = useState(''); //State that controls a message that appears when a certain code is successful
  const [activeTab, setActiveTab] = useState('posts'); // State that controls the tabs on the profile page that change based on what is written
  const [modalVisible, setModalVisible] = useState(false); //State that controls a pop up for editing your profile

  //A UseEffect that triggers our profile state earlier. It utilizes a UTILITY function called 'fetchProfileData' to gain all the user data from the back-end
  // After that if the data is available, it activates setProfile's effect and fills the empty data with the data fetched from fetchProfileData
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
//A small code that controls whether the popup is visible or not. Right now it is not because it is set to true.
  const openModal = () => {
    setModalVisible(true);
  };
//This code is responsible for when you are selecting a profile picture to use
//Upon selection it will activate and then chain setPreviewImage to preview the image prior to upload
// It will also chain setNewProfileImage and give it the value of that file which it needs.
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
      setPreviewImage(URL.createObjectURL(file));
      setNewProfileImage(file);
    }
  };
// A long and responsible code to handle the upload of an image into a 3rd party website cloudinary
//82-86 shows us why we needed to give balue to newProfileImage with a file because if there is no value this code can not function...
  const handleUpload = async () => {
    if (!newProfileImage) {
      console.error('No image selected.');
      return;
    }
  //88-101 looks complicated but here's whats happening... 89-95 attempts to upload the image. It makes a form, appends the file that you selected to newProfileImage and then grabs the upload preset from our env file sort of like a url to send it to cloudinary
    try {
      console.log('Uploading image...');
      const formData = new FormData();
      formData.append('file', newProfileImage);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData
        //Then that form data combined with the env data for our cloudinary is then uploaded to cloudinary. Basically formData(Image) is sent to cloudinary and uploaded
      );
      // The imageUrl is created the cloudinarys response.
      const imageUrl = cloudinaryResponse.data.secure_url;
      console.log('Cloudinary upload successful, image URL:', imageUrl);
      
      //once the url is grabbed it activates updatProfileImage and gives it that value, more on that below
      await updateProfileImage(imageUrl);
  
      // Manually re-fetch profile data and it reloads the site to live update this image
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
    // 122-126 gets our authToken inside of localStorage to sort of safeguard this process.
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      console.log('Updating profile image with URL:', imageUrl);
        // an important code that edits our artist and adds the profile picture url so the website remembers what we picked and can load it again.
        // Also shows why we grabbbed the authToken because this process... is protected.
      const response = await axios.post(
        '/api/artists/editArtist', 
        { profile_image_url: imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Response from profile image update:', response.data);
        // the rest of this code triggers SetProfile to add this new profileImage into our users profile front end wise to manipulate
        // It then lets us know this and then activates the SetSuccessMessage to show this to our faces
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
  // A vague code right now that will make sense later
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      
      <Row className="gx-0">
        <Col sm={2} md={2} lg={2}>
         <Navbar />
         </Col>
        <Col sm={10} md={10} lg={10}>
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
               {/* Edit profile button */}
      <LuPencilLine className="editButton" onClick={openModal} />

{/* Show the modal if it's visible */}
{modalVisible && (
  <EditProfileModal
    profile={profile}
    setModalVisible={setModalVisible}
    setProfile={setProfile}
    setSuccessMessage={setSuccessMessage}
  />
)}
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
