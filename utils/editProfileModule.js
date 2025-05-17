import React, { useState } from 'react';
import axios from 'axios';
import './editProfileModule.css'

const editProfileModal = ({
  profile,
  setModalVisible,
  setProfile,
  setSuccessMessage
}) => {
  const [updatedName, setUpdatedName] = useState(profile.name);
  const [updatedBio, setUpdatedBio] = useState(profile.bio);
  const [updatedInstagram, setUpdatedInstagram] = useState(profile.instagram);
  const [updatedTwitter, setUpdatedTwitter] = useState(profile.twitter);
  const [updatedYoutube, setUpdatedYoutube] = useState(profile.youtube);

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(
        '/api/artists/editArtist',
        {
          name: updatedName,
          bio: updatedBio,
          instagram_link: updatedInstagram,
          twitter_link: updatedTwitter,
          youtube_link: updatedYoutube
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          name: updatedName,
          bio: updatedBio,
          instagram: updatedInstagram,
          twitter: updatedTwitter,
          youtube: updatedYoutube
        }));

        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setModalVisible(false);
    }
  };

  return (
      <div className="modalOverlay">
    <div className="modalContent">
      <h2>Edit Profile</h2>
      <input
        type="text"
        value={updatedName}
        style={{
            width:"80%",
            textAlign:"center"
        }}
        onChange={(e) => setUpdatedName(e.target.value)}
        placeholder="Enter your username!"
      />
      <textarea
        value={updatedBio}
        style={{
            width:"80%",
            textAlign:"center"
        }}
        onChange={(e) => setUpdatedBio(e.target.value)}
        placeholder="Enter your bio"
      />
      <input
        type="text"
        value={updatedInstagram}
        style={{
            width:"80%",
            textAlign:"center"
        }}
        onChange={(e) => setUpdatedInstagram(e.target.value)}
        placeholder="Instagram Link"
      />
      <input
        type="text"
        value={updatedTwitter}
        style={{
            width:"80%",
            textAlign:"center"
        }}
        onChange={(e) => setUpdatedTwitter(e.target.value)}
        placeholder="Twitter Link"
      />
      <input
        type="text"
        value={updatedYoutube}
        style={{
            width:"80%",
            textAlign:"center",
            marginLeft:"40px",
            marginRight:"40px"
        }}
        onChange={(e) => setUpdatedYoutube(e.target.value)}
        placeholder="YouTube Link"
      />
      <div className='buttonZone'> 
      <button onClick={() => setModalVisible(false)}>Cancel</button>
      <button onClick={handleSaveChanges}>Save Changes</button>
      </div>
    </div>
    </div>
  );
};

export default editProfileModal;
