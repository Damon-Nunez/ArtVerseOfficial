import React, { useEffect, useState } from "react";
import "./PostModal.css"; // Create a CSS file for styling
import { CiHeart } from "react-icons/ci";
import { CiSaveDown2 } from "react-icons/ci";


const PostModal = ({ postId, onClose }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [loadingLikes, setLoadingLikes] = useState(true);
  const [isLiked, setLiked] = useState(false);

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
        setLoadingLikes(false);
      }
    };

    fetchLikes(); // Call the function inside useEffect
  }, [postId]); // Dependency array ensures this runs when postId changes

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const response = await fetch(`/api/likes/isPostLiked?id=${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assuming you store the auth token in localStorage
          },
        });

        if (!response.ok) throw new Error("Failed to check like status");

        const data = await response.json();
        setLiked(data.liked); // Set the liked state based on the response
      } catch (error) {
        console.error("Error checking like status:", error);
      } finally {
        setLoadingLikes(false);
      }
    };

    checkIfLiked();
  }, [postId]);

 // handleLike function for toggling like status
const handleLike = async (postId) => {
  try {

    if (isLiked) {
      setLikes(likes - 1); // Decrease like count if the post is being unliked
    } else {
      setLikes(likes + 1); // Increase like count if the post is being liked
    }
    // Determine the route to call based on whether the post is already liked
    const route = isLiked ? `/api/likes/deleteLike?id=${postId}` : `/api/likes/addLike?id=${postId}`;
    const method = isLiked ? 'DELETE' : 'POST'; // Use DELETE for removing like, POST for adding like

    // Send the request to either add or remove the like
    const response = await fetch(route, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assuming the token is in localStorage
      },
      body: JSON.stringify({ postId }), // For DELETE, this is optional, but you might still need it
    });

    if (!response.ok) {
      const errorMessage = await response.text(); // Get the error message from the response
      throw new Error(`Failed to toggle like: ${errorMessage}`);
    }

    // After adding/removing the like, update the liked state
    setLiked(!isLiked); // Toggle the like state
  } catch (error) {
    console.error("Error toggling like:", error.message); // Log detailed error message
  }
};


  if (loading) return <div className="modal-overlay"><div className="modal-content">Loading...</div></div>;

  if (!post) return <div className="modal-overlay"><div className="modal-content">Post not found</div></div>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="modal-body">
          <div className="left-content">
          <img src={post.content_url} alt={post.title} className="modal-image" />
          <div className="modal-details">
            <h2>{post.title}</h2>
            <p className="postDescription">{post.description}</p>
  
            {/* Like Section */}
            <div 
              className="like-section flex items-center gap-5 cursor-pointer" 
              onClick={() => !loadingLikes && handleLike(postId)}
            >
              <CiHeart 
                style={{ 
                  color: isLiked ? 'red' : 'gray', 
                  cursor: loadingLikes ? 'not-allowed' : 'pointer', 
                  fontSize: '1.5rem' 
                }} 
              />
            

              <span>
                {loadingLikes ? "Loading..." : likes} 
              </span>
              <CiSaveDown2 />
              </div>
            </div>
             </div>
         
        </div>
        <div className="right-section">
              {/*Comment section */}
              <p> testing the side </p>
            </div>
      </div>
    </div>
  );
  
};

export default PostModal;
