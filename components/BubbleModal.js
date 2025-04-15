// BubbleModal.js
import React, { useState } from 'react';
import './BubbleModal.css';

const BubbleModal = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic structure to pass data up
    const bubbleData = { title, description, isPublic };
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
