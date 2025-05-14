# ArtVerse - Favorite Feature Implementation (Post-Help Notes)

## ✅ Feature Overview
**Favorites System** - Users can favorite or unfavorite posts, and view all their favorited posts from their profile.

---

## 🛠️ Backend Implementation

### 1. **favorites Table**
```sql
CREATE TABLE favorites (
  artist_id INT REFERENCES artists(artist_id),
  post_id INT REFERENCES posts(post_id),
  favorited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (artist_id, post_id)
);
```

### 2. **Backend Routes**

- **POST /api/favorites/addFavorite**  
  Adds a post to the user's favorites (with auth and duplication check).

- **DELETE /api/favorites/removeFavorite**  
  Removes a post from the user's favorites.

- **GET /api/favorites/getUserFavorites**  
  Fetches all posts the user has favorited (joins posts table).

- **GET /api/favorites/isPostFavorited**  
  Checks if a specific post is already favorited by the current user.

---

## 🧠 Frontend Implementation

### State Variables in PostModal.js
```js
const [isFavorited, setIsFavorited] = useState(false);
```

### Favorite Check on Modal Open
```js
useEffect(() => {
  const checkIfFavorited = async () => {
    const response = await fetch(`/api/favorites/isPostFavorited?id=${postId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    });
    const data = await response.json();
    setIsFavorited(data.favorited);
  };
  checkIfFavorited();
}, [postId]);
```

### Toggle Handler
```js
const handleFavorite = async (postId) => {
  const route = isFavorited ? `/api/favorites/removeFavorite?id=${postId}` : `/api/favorites/addFavorite?id=${postId}`;
  const method = isFavorited ? 'DELETE' : 'POST';

  const response = await fetch(route, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem("authToken")}`
    },
    body: JSON.stringify({ postId })
  });

  setIsFavorited(!isFavorited);
};
```

### Icon Toggle
```jsx
<div onClick={() => handleFavorite(postId)} className="favorite-container">
  <CiHeart className={isFavorited ? "favorited" : "not-favorited"} />
</div>
```

---

## 🧩 Profile Page Favorites Tab

### State
```js
const [favoritePosts, setFavoritePosts] = useState([]);
```

### useEffect for Fetching Favorites
```js
useEffect(() => {
  if (activeTab === 'favorites') {
    const fetchFavorites = async () => {
      const response = await fetch('/api/favorites/getUserFavorites', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      setFavoritePosts(data.favorites || []);
    };
    fetchFavorites();
  }
}, [activeTab]);
```

### Render
```jsx
{activeTab === 'favorites' && (
  <div className="feed-container">
    {favoritePosts.map(post => (
      <div
        key={post.post_id}
        className="feed-item"
        onClick={() => {
          setSelectedPost(post.post_id);
          setSelectedUserId(post.user_id);
        }}
      >
        <img src={post.content_url} alt={post.description || "Favorite"} />
      </div>
    ))}
  </div>
)}
```

---

## 🎯 Outcome
- Favorite icon toggle works per post
- Favorites persist and load correctly
- Posts render under Favorites tab
- All routes and DB logic function as expected

This feature is complete and ready for Alpha.