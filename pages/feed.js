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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");


  


const fetchPosts = async (pageNum) => {
  if (!hasMore) return;

  try {
    const response = await fetch(`/api/posts/getAllPosts?page=${pageNum}&limit=20`);
    if (!response.ok) throw new Error("Failed to fetch posts");

    const data = await response.json();

    if (data.length === 0) {
      setHasMore(false); // 🛑 No more posts to fetch
    } else {
      setDefaultPosts(prev => [...prev, ...data]);
      console.log(defaultPosts);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
  fetchPosts(page);
}, [page]);


useEffect(() => {
const handleScroll = () => {
  const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
  if (bottom && hasMore) {
    setPage(prev => prev + 1);
  }
};

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  const handleSearch = async (query) => {
    console.log("handleSearch running:", query);
   if (query.trim() === "") {
    setFilteredPosts(null);
    return;
  } 
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

console.log("filteredPosts:", filteredPosts);
console.log("postsToRender:", postsToRender);
  return (
    <div>
      <Row>
        <Col sm={1} md={1} lg={1} className="colfix">
          <Navbar />
        </Col>
        <Col sm={10} md={10} lg={10} className="colfix" >
         <SearchBar
  input={searchQuery}
  setInput={setSearchQuery}
  onSearch={handleSearch}
/>

          <div className="feed-container">
         {loading ? (
  <>
    <div className="loader-overlay"></div>
    <div className="loader"></div>
  </>
): (
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
