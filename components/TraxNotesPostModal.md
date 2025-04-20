## Trax Notes README - ArtVerse

### 🎯 Goal: "Save Post to Bubble" Feature Implementation

---

### ✅ Working Flow Summary:

**1. Function: `saveToBubble(bubble_id, post_id)`**
- Grabs `authToken` from `localStorage`
- Sends `POST` request to `/api/bubbles/addPostToBubble`
- `bubble_id` is in the URL as a query param (`?id=4`)
- `post_id` is passed in the body as JSON

```js
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
```

---

**2. Passing `postId` into PostModal**
```js
const PostModal = ({ postId, onClose }) => {
  // ensure you're referencing `postId` correctly when calling saveToBubble
};
```

---

**3. User Bubbles Dropdown**
- Fetch user's bubbles in `getUserBubbles()`
- On click of save icon, show dropdown
- Each `p` tag inside dropdown triggers `saveToBubble`

```jsx
<CiSaveDown2 className="saveButton" onClick={() => setShowDropdown(true)} />

{showDropdown && userBubbles?.length > 0 && (
  userBubbles.map(bubble => (
    <p
      key={bubble.bubble_id}
      className="bubbleSaveList"
      onClick={() => saveToBubble(bubble.bubble_id, postId)}
    >
      {bubble.title}
    </p>
  ))
)}
```

---

### 🔥 Bugs Solved
- 400 Error from backend: Fixed by putting `bubble_id` in query param and `post_id` in body
- `postId` being undefined: Corrected by ensuring it’s passed from parent and used properly
- Dropdown logic: Avoided global state conflicts by scoping with `selectedBubbleId` and not relying on hover

---

### 📌 Lessons Learned
- Always confirm what your backend route expects (query vs body)
- Keep track of where props like `postId` originate from
- When debugging dropdowns, scope your `useState` or use unique IDs

---

### ✅ Next Steps
- Add animations or UI feedback for saving a post
- Consider disabling the dropdown or save icon while saving
- Optionally, update the UI without reload if needed later

---

You're crushing it, Damon. Let's keep stacking these W's 💪

