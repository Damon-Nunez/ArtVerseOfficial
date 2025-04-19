# 🧠 Post-Help-Learning Notes — `bubble/[id].js`

## 1. UseRouter vs UseParams Mismatch

**Problem:**  
The backend expected a parameter called `bubble_id`, but I was using:
```js
const { bubble_id } = useParams(); 
```
However, the file was named `[id].js`, which means the actual URL param is `id`.

**Why it happened:**  
`useParams()` (from React Router) and dynamic route names (`[id].js`) in Next.js don't align unless you manually match names. In Next.js, the `useRouter()`'s `query` object reflects the filename param.

**Fix:**  
Replaced `useParams()` with `useRouter()` and destructured `id`, renaming it to match the backend expectation:
```js
const { id } = useRouter().query;
const bubble_id = id;
```

---

## 2. Token Missing / 401 Error

**Problem:**  
Got a 401 Unauthorized error when trying to fetch posts from the bubble.

**Why it happened:**  
I forgot to attach the authentication token in the headers when making the fetch request.

**Fix:**  
Added `Authorization` header with the token:
```js
const token = localStorage.getItem('authToken');
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

---

## 3. Backend Query Error — `undefined` Input

**Problem:**  
Backend returned this error:
```
invalid input syntax for type integer: "undefined"
```

**Why it happened:**  
The `bubble_id` being passed in the query string was `undefined` because the frontend wasn’t grabbing it correctly from the URL.

**Fix:**  
Made sure `bubble_id` came from the dynamic route:
```js
const { id } = router.query;
const bubble_id = id;
```

Then used it in the fetch call:
```js
fetch(`/api/bubbles/getAllPostsFromBubble?id=${bubble_id}`)
```

---

## 4. Verifying Data Structure Returned from Fetch

**Problem:**  
I was unsure whether I should use `data` or `data.posts` after the fetch.

**Why it happened:**  
The backend response returned a JSON object like this:
```json
{
  "posts": [ ... ]
}
```

**Fix:**  
Accessed the array using:
```js
setFetchedPosts(data.posts);
```