// BubbleModal.js
import React, { useState } from 'react';
import './BubbleModal.css';

const BubbleModal = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');



  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic structure to pass data up
const bubbleData = { title, description, isPublic, thumbnailFile };
    onCreate(bubbleData);
    onClose(); // optional: close on create
  };

  return (
   // Inside BubbleModal.js
<div className="bubbleModalOverlay">
  <div className="bubbleModalContent">
    {/* Close Button */}
    <div className="closeButton" onClick={onClose}>&times;</div>
    
    <h2>Create a New Bubble</h2>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Bubble Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        Make Public
      </label>

   {thumbnailPreview && (
  <img
    src={thumbnailPreview}
    alt="Thumbnail Preview"
  style={{
  width: '100%',
  height: '400px',
  objectFit: 'cover',
  borderRadius: '10px',
  marginBottom: '1rem',
}}

  />
)}

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  }}
/>



      <div className="modalButtons">
        <button type="submit">Create</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  </div>
</div>

  );
};

export default BubbleModal;
