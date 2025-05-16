import React, { useEffect, useState } from "react";
import "./feed.css";
import Navbar from "../components/Navbar";
import { Row, Col } from "react-bootstrap";
import SearchBar from "../components/searchBar";
import PostModal from "../components/PostModal"; // Import the modal
import CommunitySelect from "../components/communitySelect";
const Feed = () => {
const [defaultPosts, setDefaultPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null); // Store the selected post ID
  const [filteredPosts, setFilteredPosts] = useState(null);
  const postsToRender = filteredPosts || defaultPosts;


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts/getAllPosts");
        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        setDefaultPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = async (query) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("Missing token");
    return;
  }

  try {
    const response = await fetch(`/api/posts/searchPost?query=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Search failed");

    const data = await response.json();
    setFilteredPosts(data.posts); // updates what is rendered
  } catch (err) {
    console.error("Search error:", err);
  }
};


  return (
    <div>
      <Row>
        <Col sm={1} md={1} lg={1} className="colfix">
          <Navbar />
        </Col>
        <Col sm={10} md={10} lg={10} className="colfix" >
          <SearchBar onSearch={handleSearch} />
          <div className="feed-container">
            {loading ? (
              <p>Loading posts...</p>
            ) : (
              postsToRender.map((post) => (
                <div
                  className="feed-item"
                  key={post.post_id}
                  onClick={() => setSelectedPost(post.post_id)} // Open modal on click
                >
                  <img src={post.content_url} alt={post.description || "Post"} />
                </div>
              ))
            )}
          </div>
        </Col>
        <Col sm={1} md={1} lg={1} className="colfix">
        <CommunitySelect/>
        </Col>
      </Row>

      {selectedPost && <PostModal postId={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
};

export default Feed;
