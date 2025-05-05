<div className="feed-container">
            {loading ? (
              <p>Loading posts...</p>
            ) : (
              fetchedPosts.map((post) => (
                <div
                  className="feed-item"
                  key={post.post_id}
                  onClick={() => {
                    setSelectedPost(post.post_id);
                    setSelectedUserId(post.user_id); // Set userId when clicking post
                  }} // Open modal on click
                >
                  <img src={post.content_url} alt={post.description || "Post"} />

                  {/* Three dots for dropdown */}
                  <BsThreeDots
                    className="three-dots-icon"
                    onClick={(e) => {
                      e.stopPropagation();  // Prevent click event from propagating to parent
                      console.log("Three dots clicked for post:", post.post_id);  // Log the post ID
                      handleDropdownToggle(post.post_id);  // Pass post_id to toggle the correct dropdown
                    }}
                  />

                  {/* Dropdown with "Remove Post" */}
                  {showDropdown === post.post_id && (
                    <div className="dropdown-menu" style={{ display: 'block' }}>
                      <p className='removePostButton' onClick={
                        (e) => {
                          e.stopPropagation();
                          removePostFromBubble(post.bubble_id, post.post_id)}
                        }
                          >
                        

                        Remove Post
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>