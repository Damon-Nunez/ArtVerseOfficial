import React from 'react'
import './[id].css'
import { useParams } from 'react-router-dom';
import { Row, Col } from "react-bootstrap";
import PostModal from "../../components/PostModal"; // Import the modal
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function BubbleView() {
    const router = useRouter();
    const { id: bubble_id } = router.query;

    const [fetchedPosts,setFetchedPosts] = useState([])
    const [loading, setLoading] = useState(true);
      const [selectedPost, setSelectedPost] = useState(null); // Store the selected post ID
    
    useEffect(() => {
        const fetchBubblePosts = async () => {
        try {

            const token = localStorage.getItem('authToken');

            if (!token) {
              console.error("Token is missing!");
              return;
            }

            const response = await fetch(`/api/bubbles/getAllPostsFromBubble?id=${bubble_id}`, {
                method:'GET',
                headers: {
                     'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
                }
            })
            if(!response.ok) throw new Error("Failed to fetch posts");
            const data = await response.json();
            console.log(data)
            setFetchedPosts(data.posts)
        }catch(error) {
            console.error("Error fetching bubble posts:", error);
        } finally {
            setLoading(false)
        }
    }
        fetchBubblePosts();
    }, [bubble_id])
  return (
    <div>
        <Row>
            <Col sm={2} md={2} lg={2}>
      <h1> welcome to the bubble view page</h1>
      <h2> This bubble is called... </h2>
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
                  onClick={() => setSelectedPost(post.post_id)} // Open modal on click
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
  )
}