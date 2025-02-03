import React, { useEffect, useState } from 'react';
import './feed.css';
import Navbar from '../components/Navbar';
import {Row,Col} from 'react-bootstrap'
import SearchBar from '../components/searchBar';

const Feed = () => {
  const [posts, setPosts] = useState([]); // Store fetched posts
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts/getAllPosts'); // Assuming the route is correctly configured
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data); // Save posts to state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

 

  return (
    <div>
      <Row>
        <Col sm={2} md={2} lg={2}>
        <Navbar/>
      </Col>
      <Col sm={10} md={10} lg={10}>
      <SearchBar/>
      <div className="feed-container">
        {loading ? (
          <p>Loading posts...</p> // Display while loading
        ) : (
          posts.map((post) => (
            <div className="feed-item" key={post.id}>
              <img src={post.content_url} alt={post.description || 'Post'} />
            </div>
          ))
        )}
      </div>
      </Col>
      </Row>
    </div>
  );
};

export default Feed;
