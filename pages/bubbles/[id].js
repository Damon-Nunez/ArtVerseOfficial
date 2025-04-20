import React, { useState, useEffect } from 'react';
import './[id].css';
import { useParams } from 'react-router-dom';
import { Row, Col } from "react-bootstrap";
import PostModal from "../../components/PostModal"; // Import the modal
import { useRouter } from 'next/router';
import { BsThreeDots } from "react-icons/bs";

export default function BubbleView() {
  const router = useRouter();
  const { id: bubble_id } = router.query;
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null); // Store the selected post ID
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null); // Track which post's dropdown is open

  // Remove post from bubble function
  const removePostFromBubble = async (bubble_id, post_id) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error("Token is missing!");
      return;
    }
    try {
      const response = await fetch(`/api/bubbles/deletePostFromBubble?id=${bubble_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id }),
      });
      if (response.ok) {
        alert('Post Removed!');
        fetchBubblePosts();
      } else {
        console.error("Failed to remove Post");
      }
    } catch (error) {
      console.error("Error deleting post from bubble");
    }
  };

  // Fetch posts from the bubble
  // Define fetchBubblePosts outside useEffect
const fetchBubblePosts = async () => {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error("Token is missing!");
      return;
    }

    const response = await fetch(`/api/bubbles/getAllPostsFromBubble?id=${bubble_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) throw new Error("Failed to fetch posts");
    const data = await response.json();
    setFetchedPosts(data.posts);
  } catch (error) {
    console.error("Error fetching bubble posts:", error);
  } finally {
    setLoading(false);
  }
};

// Now use it in useEffect
useEffect(() => {
  if (!bubble_id) return;  // guard against undefined
  fetchBubblePosts();
}, [bubble_id]);


  // Handle dropdown toggle
  const handleDropdownToggle = (post_id) => {
    setShowDropdown(prevState => prevState === post_id ? null : post_id); // Toggle dropdown for the specific post
  };

  return (
    <div>
      <Row>
        <Col sm={2} md={2} lg={2}>
          <h1>Welcome to the bubble view page</h1>
          <h2>This bubble is called...</h2>
        </Col>
        <Col sm={10} md={10} lg={10}>
          <div className="feed-container">
            {loading ? (
              <p>Loading posts...</p>
            ) : (
              fetchedPosts.map((post) => (
                <div
                  className="feed-item"
                  key={post.post_id}
                  onClick={() => {
                    setSelectedPost(post.post_id);
                    setSelectedUserId(post.user_id); // Set userId when clicking post
                  }} // Open modal on click
                >
                  <img src={post.content_url} alt={post.description || "Post"} />

                  {/* Three dots for dropdown */}
                  <BsThreeDots
                    className="three-dots-icon"
                    onClick={(e) => {
                      e.stopPropagation();  // Prevent click event from propagating to parent
                      console.log("Three dots clicked for post:", post.post_id);  // Log the post ID
                      handleDropdownToggle(post.post_id);  // Pass post_id to toggle the correct dropdown
                    }}
                  />

                  {/* Dropdown with "Remove Post" */}
                  {showDropdown === post.post_id && (
                    <div className="dropdown-menu" style={{ display: 'block' }}>
                      <p className='removePostButton' onClick={
                        (e) => {
                          e.stopPropagation();
                          removePostFromBubble(post.bubble_id, post.post_id)}
                        }
                          >
                        

                        Remove Post
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Col>
      </Row>

      {selectedPost && <PostModal postId={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
}
