import React, { useState } from 'react';
import './BubbleModal.css'; // Make sure this matches the new CSS I gave you

const BubbleModal = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (!title.trim()) {
      alert("Bubble must have a title!");
      return;
    }

    onCreate({ title, description, isPublic, thumbnailFile });
    onClose(); // Close modal after creation
  };

  return (
    <div className="bubble-modal-overlay" onClick={onClose}>
      <div className="bubble-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="bubble-left">
          {preview ? (
            <img src={preview} alt="Thumbnail Preview" />
          ) : (
            <p style={{ color: '#777', textAlign: 'center' }}>Upload a thumbnail image</p>
          )}
          <input type="file" onChange={handleThumbnailUpload} />
        </div>

        <div className="bubble-right">
          <h2>Create a New Bubble</h2>

          <input
            type="text"
            placeholder="Bubble Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <label>Make Public</label>
          </div>

          <div className="bubble-buttons">
            <button className="cancel" onClick={onClose}>Cancel</button>
            <button className="create" onClick={handleCreate}>Create</button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default BubbleModal;
