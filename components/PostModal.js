import React, { useEffect, useState } from "react";
import "./PostModal.css"; // Create a CSS file for styling
import { CiHeart } from "react-icons/ci";
import { CiSaveDown2 } from "react-icons/ci";
import Link from "next/link";


const PostModal = ({ postId, onClose }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [loadingLikes, setLoadingLikes] = useState(true);
  const [isLiked, setLiked] = useState(false);
  const [comments,setComments] = useState([])
  const [userProfile,setUserProfile] = useState(null)
  const [userId, setUserId] = useState(null)
  const [newComment,setNewComment] = useState(null)
  const [showDropdown,setShowDropdown] = useState(false)
  const [userBubbles,setUserBubbles] = useState([])


  const fetchUserBubbles = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      alert("You must be logged in to save posts to bubbles!");
      return;
    }
  
    try {
      const response = await fetch('/api/bubbles/getUserBubbles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setUserBubbles(data.bubbles); // assuming you use setUserBubbles to store the fetched bubbles
      } else {
        console.error('Failed to fetch bubbles.');
      }
    } catch (error) {
      console.error('Error fetching bubbles:', error);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      fetchUserBubbles();
    }
  }, [showDropdown]);  // Run this whenever the dropdown is toggled
  
  
  const saveToBubble = async (bubble_id) => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      alert("You must be logged in to save posts!");
      return;
    }
  
    try {
      const response = await fetch(`/api/bubbles/addPostToBubble?id=${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ bubble_id }),
      });

      if (response.status === 409) {
        alert("This post is already in that bubble.");
        return;
      }
  
      if (!response.ok) throw new Error("Failed to save post to bubble");
      alert("Post has been saved to your bubble!");
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };
  
  

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }
  
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      alert("You must be logged in to comment.");
      return;
    }
  
    try {
      const response = await fetch(`/api/comments/addComment?id=${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ comment_text: newComment }),
      });
  
      if (!response.ok) throw new Error("Failed to add comment");
  
      const newCommentData = await response.json(); // Assuming the response returns the new comment data
      setComments([newCommentData, ...comments]); // Add the new comment to the top
      setNewComment(""); // Clear the input
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        setPost(data);
        if (data && data.user_id) { // Check if post and user_id exist
          setUserId(data.user_id);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPost();
  }, [postId]);
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`api/artists/getArtistProfile?id=${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}` // Add the token here
          }
        });
        if(!response.ok) throw new Error("Failed to fetch user profiles");
        const data = await response.json();
        setUserProfile(data)
      } catch(error) {
        console.error("Error fetching profile:" , error);
      }
    };
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/getCommentsFromPost?id=${postId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}` // Add the token here
          }
        });
        const data = await response.json();
        setComments(data.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
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
            <div className="modal-user-details"> 
              <img className="user-profile-image" 
            src= {userProfile ? userProfile.profile_image_url : 'loading...'} 
            ></img>
            <h2 className="user-profile-name"> {userProfile ? userProfile.name : 'Loading...'}</h2>
           
            </div>
            <h2>{post.title}</h2>
            <p className="postDescription">{post.description}</p>
  
            {/* Like Section */}
            <div 
              className="like-section flex items-center gap-10 cursor-pointer" 
              onClick={() => !loadingLikes && handleLike(postId)}
            >
              <CiHeart className="heart"
                style={{ 
                  color: isLiked ? 'red' : 'gray', 
                  cursor: loadingLikes ? 'not-allowed' : 'pointer', 
                  fontSize: '1.5rem' 
                }} 
              />
            </div>

              <span>
                {loadingLikes ? "Loading..." : likes} 
              </span>
              <CiSaveDown2 className="saveButton" onClick={() => { setShowDropdown(true);}} />
              {userBubbles && userBubbles.length > 0 ? (
  userBubbles.map(bubble => (
    <p className="bubbleSaveList" key={bubble.bubble_id} onClick={() => saveToBubble(bubble.bubble_id)}>
      {bubble.title} {/* Or whatever the bubble property is */}
    </p>
  ))
) : (
  <p>No bubbles found</p>
)}
              
            </div>
             </div>
         
        </div>
        <div className="right-section">
  <div className="comments-section">
    {comments.length === 0 ? (
      <p>No comments yet. Be the first to comment!</p>
    ) : (
      comments.map((comment) => (
        <div key={comment.comment_id} className="comment-item">
          <div className="comment-header">
            {/* Profile Image */}
            {comment.profile_image_url ? (
              <img
                src={comment.profile_image_url}
                alt={`${comment.name}'s profile`}
                className="comment-profile-image"
              />
            ) : (
              <div className="default-profile-image">
            <p>{comment.name && comment.name[0]}</p>               </div>
            )}
            <Link href={`/users/${comment.artist_id}`}>
  <strong>{comment.name}</strong>
</Link>


          </div>
          <p>{comment.comment_text}</p>
        </div>
      ))
    )}

  </div>
  <div className="commentBar">
  <input
    type="text"
    placeholder="Write a comment..." // Guides the user
    value={newComment} // Binds input value to state
    onChange={(e) => setNewComment(e.target.value)} // Updates state on input
  />
  <button onClick={handleCommentSubmit}>Post</button>
</div>
</div>


      </div>
    </div>
  );
  
};

export default PostModal;
