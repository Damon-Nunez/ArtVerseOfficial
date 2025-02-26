import React, { useEffect, useState } from "react";
import "./postModal.css"; // Create a CSS file for styling

const PostModal = ({ postId, onClose }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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
            <p><strong>Likes:</strong> {post.likes || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
