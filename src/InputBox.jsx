// src/InputBox.js
import React, { useState } from 'react';

function InputBox({ onSendMessage }) {
  const [input, setInput] = useState('');

  // Function to handle sending the message
  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput(''); // Clear the input after sending
    }
  };

  // Listen for Enter key press in the input field
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="input-box">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress} // Trigger handleSend on Enter key press
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default InputBox;