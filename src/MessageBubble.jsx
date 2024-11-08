// src/MessageBubble.js
import React from 'react';
import './MessageBubble.css';

function MessageBubble({ message }) {
  return (
    <div className={`message-container ${message.sender}`}>
      <img src={message.profile} alt={`${message.sender}-profile`} className="profile-icon" />
      <div className={`message-bubble ${message.sender}`}>
        {message.text}
      </div>
    </div>
  );
}

export default MessageBubble;
