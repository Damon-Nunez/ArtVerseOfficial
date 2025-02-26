import React, { useEffect, useState } from "react";
import "./feed.css";
import Navbar from "../components/Navbar";
import { Row, Col } from "react-bootstrap";
import SearchBar from "../components/searchBar";
import PostModal from "../components/PostModal"; // Import the modal

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null); // Store the selected post ID

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts/getAllPosts");
        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <Row>
        <Col sm={2} md={2} lg={2}>
          <Navbar />
        </Col>
        <Col sm={10} md={10} lg={10}>
          <SearchBar />
          <div className="feed-container">
            {loading ? (
              <p>Loading posts...</p>
            ) : (
              posts.map((post) => (
                <div
                  className="feed-item"
                  key={post.id}
                  onClick={() => setSelectedPost(post.id)} // Open modal on click
                >
                  <img src={post.content_url} alt={post.description || "Post"} />
                </div>
              ))
            )}
          </div>
        </Col>
      </Row>

      {selectedPost && <PostModal postId={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
};

export default Feed;
