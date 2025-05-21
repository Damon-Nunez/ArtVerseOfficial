import React, { useState, useEffect } from 'react';
import './[id].css';
import { useParams } from 'react-router-dom';
import { Row, Col } from "react-bootstrap";
import PostModal from "../../components/PostModal"; // Import the modal
import { useRouter } from 'next/router';
import { BsThreeDots } from "react-icons/bs";
import Navbar from '../../components/Navbar';
import { CiLock } from "react-icons/ci";
import SearchBar from '../../components/searchBar';
import { PiNotePencilDuotone } from "react-icons/pi";
import CommunitySelect from '../../components/communitySelect';



export default function BubbleView() {
  const router = useRouter();
  const { id: bubble_id } = router.query;
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null); // Track which post's dropdown is open
  const [bubbleInfo, setBubbleInfo] = useState([])
  const [filteredPosts, setFilteredPosts] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
  const postsToRender = filteredPosts || fetchedPosts;



  const handleSearch = (query) => {
  const lowerQuery = query.toLowerCase();
  const filtered = fetchedPosts.filter(post =>
    post.title?.toLowerCase().includes(lowerQuery) ||
    post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
  setFilteredPosts(filtered);
};


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

useEffect(() => {
  const fetchBubbleInfo = async () => {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error("Token is missing!");
      return;
    }

    const response = await fetch(`/api/bubbles/getBubbleInfo?id=${bubble_id}`)
    const data = await response.json();
    if(data) {
      console.log('setting BubbleInfo state with data:', data);
      setBubbleInfo(data.bubbles[0]); // just the bubble itself
    }
    console.log(data)
  }catch(error) {
    console.error("Error fetching bubble information", error);
  }
}
fetchBubbleInfo();
},
[])


  // Handle dropdown toggle
  const handleDropdownToggle = (post_id) => {
    setShowDropdown(prevState => prevState === post_id ? null : post_id); // Toggle dropdown for the specific post
  };
// or setBubbleInfo(bubbleInfo) if using useState


  return (
    <div>
      <Row>
        <Col sm={1} md={1} lg={1} className='colFix'>
          <Navbar/>
        </Col>
        <Col sm={10} md={10} lg={10} className='colFix'>
 <SearchBar
  input={searchQuery}
  setInput={setSearchQuery}
  onSearch={handleSearch}
/>
        <div className='topBubbleView'>
          <div className='groupMove'>
          <h2 className='bubbleTitle'> {bubbleInfo.title} </h2>
          <div className="privacyInfo">
          {bubbleInfo && bubbleInfo.is_public === false && <h2>Private</h2>}
          <CiLock className='lockResize' />
  </div>
  </div>
          </div>
          <div className="feed-container">
            {loading ? (
              <p>Loading posts...</p>
            ) : (
              postsToRender.map((post) => (
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
                  <PiNotePencilDuotone
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
        <Col sm={1} md={1} lg={1}>
        <CommunitySelect/>
        </Col>
      </Row>

      {selectedPost && <PostModal postId={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
}
