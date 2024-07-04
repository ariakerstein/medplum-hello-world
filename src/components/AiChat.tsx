import React, { useState } from 'react';

const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    // Add user message
    setMessages(prev => [...prev, { text: inputText, isUser: true }]);

    // TODO: Send message to AI service and get response
    // This is a placeholder response
    const aiResponse = "This is a placeholder AI response. Implement actual AI integration here.";

    // Add AI response
    setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);

    setInputText('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>AI Chat</h1>
      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '10px', textAlign: message.isUser ? 'right' : 'left' }}>
            <span style={{ background: message.isUser ? '#007bff' : '#28a745', color: 'white', padding: '5px 10px', borderRadius: '10px' }}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ flexGrow: 1, marginRight: '10px', padding: '5px' }}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} style={{ padding: '5px 10px' }}>Send</button>
      </div>
    </div>
  );
};

export default AiChat;