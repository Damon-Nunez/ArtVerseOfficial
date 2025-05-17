import React, { useState,useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaHome, FaPlusCircle, FaBell } from 'react-icons/fa';
import { MdOutlineExplore } from 'react-icons/md';
import { FiMessageCircle } from 'react-icons/fi';
import { FaPeopleGroup } from 'react-icons/fa6';
import { GrStatusPlaceholder } from 'react-icons/gr';
import { useRouter } from 'next/router';
import { fetchProfileData } from '../utils/api';
import { IoHome } from "react-icons/io5";
import { MdExplore } from "react-icons/md";
import { FaRegPlusSquare } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { IoIosNotifications } from "react-icons/io";
import { IoLogOutSharp } from "react-icons/io5";

import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; // Update this file to style your sidebar

const Navbar = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [title,setTitle] = useState('')
  const [visibility, setVisibility] = useState('public');
  const [base64Image, setBase64Image] = useState(null);

  const [profile, setProfile] = useState({
    name: '',
    profileImage: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfileData();
        if (data) {
          setProfile({
            name: data.name || '',
            profileImage: data.profile_image_url || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };
    loadProfile();
  }, []);

  const navigateToFeed = () => {
    router.push('/feed');
  };

  const navigateToProfile = () => {
    router.push('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        setPreview(reader.result);
        setBase64Image(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!base64Image) {
      alert('Please upload an image!');
      return;
    }

    const token = localStorage.getItem('authToken');
    const postData = {
      user_id: 'YOUR_USER_ID',
      title,
      image: `data:image/jpeg;base64,${base64Image}`,
      description,
      tags: tags.trim().split(/[\s,]+/),
      type: visibility,
    };

    try {
      const response = await fetch('/api/posts/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert('Post created successfully!');
        setShowModal(false);
        setImage(null);
        setPreview(null);
        setTags('');
        setDescription('');
        setVisibility('public');
      } else {
        alert('Failed to create post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-items">
        <div className='sidebar-item'>
         <img
  onClick={navigateToProfile}
  src={profile.profileImage || "/images/defaultpfp.webp"}
  alt="Profile"
  className="profile-picture"
/>

          
        </div>
      <div className="sidebar-item tooltip-wrapper">
  <IoHome onClick={navigateToFeed}/>
  <span className="tooltip-text">Home</span>
</div>

       <div className="sidebar-item tooltip-wrapper">
  <MdExplore />
  <span className="tooltip-text">Explore</span>
</div>

<div className="sidebar-item tooltip-wrapper" onClick={() => setShowModal(true)}>
  <FaRegPlusSquare />
  <span className="tooltip-text">Create Post</span>
</div>

<div className="sidebar-item tooltip-wrapper">
  <AiFillMessage />
  <span className="tooltip-text">Messages</span>
</div>

<div className="sidebar-item tooltip-wrapper">
  <IoIosNotifications />
  <span className="tooltip-text">Notifications</span>
</div>

<div className="sidebar-item tooltip-wrapper">
  <FaPeopleGroup />
  <span className="tooltip-text">Communities</span>
</div>

<div className="sidebar-item tooltip-wrapper" onClick={handleLogout}>
  <IoLogOutSharp />
  <span className="tooltip-text">Log Out</span>
</div>

      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="create-post-modal">
        <Modal.Header closeButton>
          <Modal.Title>Create a Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" onChange={handleImageUpload} />
          </Form.Group>
          {preview && <img src={preview} alt="Preview" style={{ width: '10rem', height: '10rem' }} />}
          <Form.Group controlId="titleInput" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Title your post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="tagsInput" className="mb-3">
            <Form.Label>Tags</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter tags (separated by spaces or commas)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="descriptionInput" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write something about your post"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="visibilitySelect" className="mb-3">
            <Form.Label>Visibility</Form.Label>
            <Form.Control
              as="select"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="community">Community</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePost}>
            Post
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Navbar;
