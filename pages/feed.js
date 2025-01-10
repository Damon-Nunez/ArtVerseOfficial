import React, { useEffect, useState } from 'react';
import './feed.css';
import Navbar from '../components/navbar';

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
      <Navbar />
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
    </div>
  );
};

export default Feed;
