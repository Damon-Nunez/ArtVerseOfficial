
# ArtVerse Bubble View – Trax Progress Log

## ✅ Completed Features (April 20, 2025)

### 1. Post-Specific Dropdown Menu

**Problem:**  
Multiple dropdowns were appearing or none at all. Using a global `showDropdown` state caused conflicts and unpredictable behavior.

**Solution:**  
Refactored the dropdown logic to use `selectedPostId`, similar to how `selectedBubbleId` works. Each post now checks if its ID matches the selected one to show its dropdown.

**Code Snippet:**
```jsx
<BsThreeDots
  className="three-dots-icon"
  onClick={(e) => {
    e.stopPropagation();
    setSelectedPostId(prev =>
      prev === post.post_id ? null : post.post_id
    );
  }}
/>

{selectedPostId === post.post_id && (
  <div className="dropdown-menu">
    <p onClick={(e) => {
      e.stopPropagation();
      removePostFromBubble(post.bubble_id, post.post_id);
    }}>Remove Post</p>
  </div>
)}
```

---

### 2. Remove Post from Bubble (Fully Connected Backend)

**Problem:**  
Needed to wire up a DELETE API call with the frontend, passing both `bubble_id` and `post_id`.

**Solution:**  
Built the `removePostFromBubble()` function with proper headers, error handling, and user feedback. Refreshed the page after removal.

**Code Snippet:**
```js
const removePostFromBubble = async (bubble_id, post_id) => {
  const token = localStorage.getItem('authToken');
  if (!token) return;

  try {
    const response = await fetch(`/api/bubbles/deletePostFromBubble?id=${bubble_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post_id }),
    });

    if (response.ok) {
      alert('Post Removed!');
      router.replace(router.asPath);  // Avoids undefined query param glitch
    }
  } catch (err) {
    console.error("Error deleting post from bubble", err);
  }
};
```

---

### 3. Prevent Modal from Triggering on Dropdown Click

**Problem:**  
Clicking “Remove Post” also triggered the PostModal due to propagation.

**Solution:**  
Used `e.stopPropagation()` on the delete click to isolate the interaction.

**Snippet:**
```jsx
<p
  className='removePostButton'
  onClick={(e) => {
    e.stopPropagation();
    removePostFromBubble(post.bubble_id, post.post_id);
  }}
>
  Remove Post
</p>
```

---

## 🔄 Trax Learning Notes

- Use unique identifiers (`post_id`, `bubble_id`) instead of global booleans for scoped state.
- `router.replace(router.asPath)` is a cleaner way to refresh the page without causing param errors.
- Always stop propagation when nested click elements overlap in function.

---

## 🎯 Next Steps

We'll handle the next updates in the **design pass**.
