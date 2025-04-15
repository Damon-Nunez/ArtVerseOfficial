// pages/users/[id].js
import { generateWhiteStars } from '../../utils/generateWhiteStars';
import { FaInstagram } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { LuPencilLine } from "react-icons/lu";
import axios from 'axios';
import EditProfileModal from '../../utils/editProfileModule';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Navbar from '../../components/Navbar';
import { fetchProfileData } from '../../utils/api';
import './[id].css'

export default function PublicProfile() {
    const [activeTab, setActiveTab] = useState('posts'); // State that controls the tabs on the profile page that change based on what is written
  const router = useRouter()
  const { id } = router.query

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

  useEffect(() => {
      const loadProfile = async () => {
        try {
          const data = await fetchProfileData(id);  
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
  
      if (router.isReady) {
        loadProfile();
      }
    }, [id, router.isReady]); 

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
                    src={profile.profileImage || '/default-profile.png'}
                    alt="Profile"
                      className="profileImage"
                    />
                  </div>
                </div>
    
                <div className="profileHeader">
                  <p className="profileText"><b>{profile.name}</b></p>
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
                    <div className='bubbleGrid'>
                      <h1> This is where the cards will be</h1>
                    </div>
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