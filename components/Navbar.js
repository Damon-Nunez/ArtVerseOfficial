import React, { useState } from 'react';
import { Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { FaHome, FaPlusCircle, FaBell } from 'react-icons/fa';
import { MdOutlineExplore } from 'react-icons/md';
import { FiMessageCircle } from 'react-icons/fi';
import { FaPeopleGroup } from 'react-icons/fa6';
import { GrStatusPlaceholder } from 'react-icons/gr';
import { useRouter } from 'next/router';

import './navbar.css';

const Navbar = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [base64Image, setBase64Image] = useState(null);

  const navigateToFeed = () => {
    console.log("Navigating to Feed...");
    router.push('/feed');
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log("File loaded successfully");
        const base64String = reader.result.split(",")[1]; // Extract base64 string
        setPreview(reader.result); // Set the preview for UI
        setBase64Image(base64String); // Set the base64 string for the backend
        console.log("Base64 Image:", base64String); // Log for debugging
      };
      reader.onerror = (error) => {
        console.error("Error loading file:", error);
      };
      reader.readAsDataURL(file);
    } else {
      console.error("No file selected");
    }
  };

  const handlePost = async () => {
    console.log("Attempting to create a post...");
  
    if (!base64Image) {
      alert("Please upload an image!");
      console.error("No image uploaded");
      return;
    }
  
    // Log the token to verify if it's being retrieved
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    console.log("Authorization Token:", token);
  
    // Create the object that will be sent in the POST request
    const postData = {
      user_id: 'YOUR_USER_ID', // Replace with actual user ID
      image: `data:image/jpeg;base64,${base64Image}`, // Ensure base64 string is in the correct format
      description,
      tags: tags.split(','),
      type: visibility,
    };
    console.log("Post Data Object:", postData); // Log the object being sent to the backend
  
    try {
      const response = await fetch('/api/posts/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '', // Include token in header
        },
        body: JSON.stringify(postData), // Send the postData object in the request body
      });
  
      if (response.ok) {
        console.log("Post created successfully!");
        alert('Post created successfully!');
        setShowModal(false);
        setImage(null);
        setPreview(null);
        setTags('');
        setDescription('');
        setVisibility('public');
      } else {
        const errorData = await response.json();
        console.error("Failed to create post. Error:", errorData);
        alert('Failed to create post.');
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  

  return (
    <div className="navBackground">
      <Row>
        <Col sm={12} md={12} lg={12}>
          <div className="navBlock">
            <div className="navItems">
              <div className="navItemsChildren" onClick={navigateToFeed} style={{ cursor: 'pointer' }}>
                <GrStatusPlaceholder />
                <span className="navText">Home</span>
              </div>
              <div className="navItemsChildren">
                <MdOutlineExplore />
                <span className="navText">Explore</span>
              </div>
              <div
                className="navItemsChildren"
                onClick={() => setShowModal(true)} // Open modal on click
                style={{ cursor: 'pointer' }}
              >
                <FaPlusCircle />
                <span className="navText">Post</span>
              </div>
            </div>

            <input
              type="text"
              placeholder="Search..."
              className="searchBar"
              style={{
                width: '40rem',
                height: '3rem',
                fontSize: '1.2rem',
                borderRadius: '5px',
                border: '1px solid #ccc',
                outline: 'none',
                marginLeft: '2rem',
                alignItems: 'center',
              }}
            />

            <div className="navBlockPt2">
              <div className="navItemsPt2">
                <FiMessageCircle />
                <span className="navTextPt2">Messages</span>
              </div>
              <div className="navItemsPt2">
                <FaBell />
                <span className="navTextPt2">Notifications</span>
              </div>
              <div className="navItemsPt2">
                <FaPeopleGroup />
                <span className="navTextPt2">Groups</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Modal for creating a post */}
      <Modal show={showModal} onHide={() => setShowModal(false)}
         dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            Create a Post
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <div>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control type="file" onChange={handleImageUpload} />
                </Form.Group>
                {preview && <img src={preview} alt="Preview" style={{ width: '10rem', height: '10rem' }} />}
              </div>
            </Col>
            <Col md={6}>
              <Form.Group controlId="tagsInput" className="mb-3">
                <Form.Label>Tags</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter tags (comma-separated)"
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
            </Col>
          </Row>
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
