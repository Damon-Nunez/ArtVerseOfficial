import { useRouter } from 'next/router';
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
import { FaPlus } from "react-icons/fa";
import BubbleModal from '../components/BubbleModal';
import { CiLock } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import CommunitySelect from '../components/communitySelect';
import Link from 'next/link';
import SearchBar from '../components/searchBar';
import PostModal from "../components/PostModal"; // Import the modal
import { PiNotePencilDuotone } from "react-icons/pi";




function Profile() {
  // A UseState Code that will later be used to fetch the data of our user. It remains blank until our other code triggers its activation and fills
  // in the data from the back-end DataBase.
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    profileImage: '',
    artist_id: '',
    followers_count: 0,
    following_count: 0,
    instagram: '',
    twitter: '',
    youtube: ''
  });

  const handleDelete = async (bubble_id) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        console.error("Token is missing!");
        return;
      }
      console.log("Attempting to delete bubble with ID:", bubble_id);
      const response = await fetch(`/api/bubbles/deleteBubble?id=${bubble_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bubble_id }),
      });
  
      if (response.ok) {
        alert('Bubble deleted successfully!');
        window.location.reload();
      } else {
        console.error('Failed to delete bubble.');
      }
    } catch (error) {
      console.error('Error deleting bubble:', error);
    }
  };

  const deletePost = async (post_id) => {
    try {
      const token = localStorage.getItem('authToken');
  
      if (!token) {
        console.error("Token is missing!");
        return;
      }
  
      const response = await fetch(`/api/posts/deletePost?post_id=${post_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });


      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
  
      const data = await response.json();
      console.log("Post deleted:", data);
      alert("Post deleted!");
  
      // Optionally refetch posts or remove from state
      setUserPosts(prev => prev.filter(p => p.post_id !== post_id));
  
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  
  
 
  const handleDropdownClick = () => {
    setShowDropdown(prev => {
      console.log("Dropdown state changed: ", !prev);  // Check if state is toggling
      return !prev;
    });
  };

const handleCreateBubble = async ({ title, description, isPublic, thumbnailFile }) => {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error("Token is missing!");
      return;
    }

    let thumbnail = null;

    if (thumbnailFile) {
      const formData = new FormData();
      formData.append('file', thumbnailFile);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      try {
        const cloudinaryRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        thumbnail = cloudinaryRes.data.secure_url;
        console.log('Uploaded thumbnail to Cloudinary:', thumbnail);
      } catch (uploadError) {
        console.error('Failed to upload thumbnail:', uploadError);
      }
    }

    const res = await fetch('/api/bubbles/createBubble', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        is_public: isPublic,
        thumbnail,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to create bubble');
    }

    const data = await res.json();
    console.log('Bubble created:', data);

    alert("Bubble created successfully!");
    window.location.reload(); // Refresh the page

  } catch (err) {
    console.error(err);
  }
};


  const toggleModal = () => {
    setIsModalOpen((prev) => !prev); // Toggle the modal visibility
  };

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.error("Token is missing!");
          return;
        }
        const response = await fetch(`/api/posts/getUserPosts?id=${id}`, {
          method: 'GET', // For creating new data
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }   
        });
        if(!response.ok) throw new Error("Failed to fetch user posts");
        const data = await response.json();
        console.log(data)
        setUserPosts(data.posts)
      }catch(error) {
        console.error("Error fetching user posts", error);
      }
    }
    getUserPosts();

  },
[])
  

  // Many useState codes that also remain null or empty until another code triggers its activation and fill itself with something.
  const [newProfileImage, setNewProfileImage] = useState(null); //State that controls the profile picture
  const [previewImage, setPreviewImage] = useState(''); // State that controls what you see before uploading the profile picture
  const [successMessage, setSuccessMessage] = useState(''); //State that controls a message that appears when a certain code is successful
  const [activeTab, setActiveTab] = useState('posts'); // State that controls the tabs on the profile page that change based on what is written
  const [modalVisible, setModalVisible] = useState(false); //State that controls a pop up for editing your profile
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bubbles,setBubbles] = useState([]);
  const [selectedBubbleId, setSelectedBubbleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [favoritePosts, setFavoritePosts] = useState([]);



    
  //A UseEffect that triggers our profile state earlier. It utilizes a UTILITY function called 'fetchProfileData' to gain all the user data from the back-end
  // After that if the data is available, it activates setProfile's effect and fills the empty data with the data fetched from fetchProfileData
  const router = useRouter();
  const { id } = router.query;  // Get the id from the URL

  useEffect(() => {
    const fetchUserBubbles = async () => {
      try {

        const token = localStorage.getItem('authToken');

        if (!token) {
          console.error("Token is missing!");
          return;
        }

          const response = await fetch("/api/bubbles/getUserBubbles", {
            method: 'GET', // For creating new data
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }})
          if(!response.ok) throw new Error("Failed to fetch User Bubbles");
          const data = await response.json();
          console.log(data)
          setBubbles(data.bubbles || []);
      } catch(error) {
        console.error("Error fetching bubbles:", error);
      }finally {
        setLoading(false)
      }
    };

    fetchUserBubbles();
  },
  [])

   useEffect(() => {
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error("Token is missing!");
        return;
      }

      const response = await fetch(`/api/favorites/getUserFavorites`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to fetch favorites");

      const data = await response.json();
      setFavoritePosts(data.favorites || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  if (activeTab === 'favorites') {
    fetchFavorites();
  }
}, [activeTab]);

useEffect(() => {
  const handleClickOutside = () => setShowDropdown(null);
  window.addEventListener('click', handleClickOutside);
  return () => window.removeEventListener('click', handleClickOutside);
}, []);


  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Pass the `id` (or undefined for current user's profile)
        const data = await fetchProfileData(id || null);  // If no id, fetch current user's profile
        console.log('Fetched profile data:', data);

        if (data) {
          console.log('Setting profile state with data:', data);
          setProfile({
            name: data.name || '',
            bio: data.bio || '',
            profileImage: data.profile_image_url || '',
            artist_id: data.artist_id || '',
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

    // Only run when the router is ready (use router.query safely)
    if (router.isReady) {
      loadProfile();
    }
  }, [id, router.isReady]);  // Make sure to watch for changes in `id` and router readiness
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

  const handleDropdownToggle = (post_id) => {
    setShowDropdown(prev => prev === post_id ? null : post_id);
  };
  
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
        <Col sm={1} md={1} lg={1}>
         <Navbar />
         </Col>
        <Col sm={10} md={10} lg={10}>
          <div className="profileBlock">

            <div className="profileImageWrapper">
              <div className="profileImageContainer">
                <img
  src={previewImage || profile.profileImage || "/images/defaultpfp.webp"}
  alt="Profile"
  className={profile.profileImage ? "profileImage" : "profileImage defaultProfileImage"}
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
           {activeTab === 'posts' && (
  <>
    <div className='postsWrapper'>
      <div className="feed-container">
        {userPosts.length === 0 ? (
          <p style={{ opacity: 0.6, fontSize: "30px", display:"flex", justifyContent:"center", color:"white" }}>No posts yet...</p>
        ) : (
          userPosts.map(post => (
            <div
              key={post.post_id}
              className="feed-item"
              onClick={() => {
                setSelectedPost(post.post_id);
                setSelectedUserId(post.user_id);
              }}
            >
              <PiNotePencilDuotone
                className="three-dots-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownToggle(post.post_id);
                }}
              />
              {showDropdown === post.post_id && (
                <div className="dropdown-menu" style={{ display: 'block' }}>
                  <p
                    className="removePostButton"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePost(post.post_id);
                    }}
                  >
                    Delete Post
                  </p>
                </div>
              )}
              <img src={post.content_url} alt={post.description || "Post"} />
            </div>
          ))
        )}
      </div>
    </div>

    {selectedPost && (
      <PostModal postId={selectedPost} onClose={() => setSelectedPost(null)} />
    )}
  </>
)}

{activeTab === 'favorites' && (
  <div className="feed-container">
    {favoritePosts.length === 0 ? (
      <p style={{ opacity: 0.6, fontSize: "30px", display:"flex", justifyContent:"center", color:"white"}}>
        No favorites yet.
      </p>
    ) : (
      favoritePosts.map(post => (
        <div
          key={post.post_id}
          className="feed-item"
          onClick={() => {
            setSelectedPost(post.post_id);
            setSelectedUserId(post.user_id);
          }}
        >
          <img src={post.content_url} alt={post.description || "Favorite"} />
        </div>
      ))
    )}
  </div>
)}


  {activeTab === 'bubbles' && (
    <div>
      <div className='bubbleGrid'>
        <div className='createBubbleCard' onClick={() => setIsModalOpen(true)}>
          <FaPlus className='addBubble' />
        </div>

        {isModalOpen && (
          <BubbleModal
            onClose={toggleModal} // Pass the close function to BubbleModal
            onCreate={handleCreateBubble} // Pass the create function to BubbleModal
          />
        )}

       {loading ? (
  <p>Loading bubbles...</p>
) : (
  bubbles.map((bubble) => (
    <div
      className="bubble-item"
      key={bubble.bubble_id}
      onClick={() => router.push(`/bubbles/${bubble.bubble_id}`)}
      onMouseLeave={() => {
        if (selectedBubbleId === bubble.bubble_id) {
          setSelectedBubbleId(null);
        }
      }}
    >
            <CiLock className={bubble.is_public ? 'privateLockInvisible' : 'privateLock'} />
          
            <BsThreeDots
  className="threeDots"
  onClick={(e) => {
    e.stopPropagation();  // 🛑 Prevents the bubble-item redirect
    console.log("3 dots clicked on bubble:", bubble.bubble_id);
    setSelectedBubbleId(prev =>
      prev === bubble.bubble_id ? null : bubble.bubble_id
    );
  }}
/>

          
            {selectedBubbleId === bubble.bubble_id && (
              <div className="dropdown-menu" style={{ display: 'block' }}>
                <p onClick={() => console.log("Share clicked")}>Share</p>
                <p className='deleteBubbleDropDown' onClick={() => handleDelete(bubble.bubble_id)}>Delete Bubble?</p>
                </div>
            )}
          
         <Link href={`/bubbles/${bubble.bubble_id}`} legacyBehavior>
  <a className="bubble-link">
    {bubble.thumbnail ? (
      <img src={bubble.thumbnail} alt="Bubble Thumbnail" className="bubble-thumbnail" />
    ) : (
      <div className="bubble-thumbnail default-frame"></div>
    )}
    <div className="bubble-title">{bubble.title}</div>
  </a>
</Link>


          </div>   
          ))
        )}
      </div>
    </div>
  )}
</div>

          </div>
        </Col>
        <Col sm={1} md={1} lg={1}>
        <CommunitySelect/>
        </Col>
      </Row>

      {selectedPost && <PostModal postId={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
}

export default Profile;

