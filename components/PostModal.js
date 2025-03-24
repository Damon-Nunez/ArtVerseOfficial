import React, { useEffect, useState } from "react";
import "./postModal.css"; // Create a CSS file for styling
import { CiHeart } from "react-icons/ci";



const PostModal = ({ postId, onClose }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0)
  const [loadingLikes,setloadingLikes] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) throw new Error("Failed to fetch post");

        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(`/api/likes/getLikesFromPost?id=${postId}`);
        if (!response.ok) throw new Error("Failed to fetch likes");
        const data = await response.json();
        setLikes(data || 0); // Directly set the like count if it's just a number
      } catch (error) {
        console.error("Error fetching likes:", error);
      } finally {
        setloadingLikes(false);
      }
    };
  
    fetchLikes(); // Call the function inside useEffect
  }, [postId]); // Dependency array ensures this runs when postId changes
  

  if (loading) return <div className="modal-overlay"><div className="modal-content">Loading...</div></div>;

  if (!post) return <div className="modal-overlay"><div className="modal-content">Post not found</div></div>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="modal-body">
          <img src={post.content_url} alt={post.title} className="modal-image" />
          <div className="modal-details">
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            {/* Conditional Rendering for Likes */}
            <p>
              <CiHeart /> 
              {loadingLikes ? "Loading..." : likes} {/* Display likes when fetched, or Loading... while it's being fetched */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default PostModal;
