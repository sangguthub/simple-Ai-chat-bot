import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import './App.css'; // We'll add some basic styles

function App() {
  // State to hold the current message being typed
  const [input, setInput] = useState('');

  // State to hold all messages in the chat
  const [messages, setMessages] = useState([]);

  // Function to handle sending a message
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    if (!input.trim()) return; // Don't send empty messages

    // Add user's message to the messages list
    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Clear the input field
    const messageToSend = input;
    setInput('');

    try {
      // Send the user's message to the backend
      const response = await axios.post('http://localhost:5001/chat', {
        message: messageToSend,
      });

      // Get the bot's reply from the backend
      const botReply = response.data.reply;

      // Add the bot's message to the messages list
      const botMessage = { sender: 'bot', text: botReply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally show an error message to the user
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="App">
      <div className="chat-window">
        <div className="messages-list">
          {/* Map over the messages and display them */}
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        {/* The chat input form */}
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;