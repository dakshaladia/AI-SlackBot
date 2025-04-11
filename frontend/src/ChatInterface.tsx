import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

interface ChatResponse {
    user: string;
    ai: string;
}

const ChatInterface: React.FC = () => {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState<ChatResponse[]>([]); 

    const sendMessage = async () => {
        if (!message) return;

        try {
            const response = await axios.post('http://localhost:5001/api/chat', { message });
            setResponses([...responses, { user: message, ai: response.data.response }]); 
            setMessage(''); // Clear the input field
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="App">
            <div className="ChatContainer">
                <div>
                    {responses.map((resp, index) => (
                        <div key={index}>
                            <div className="user-query-box">
                                <strong>User:</strong> {resp.user}
                            </div>
                            <div className="response-box">
                                <strong>Slackbot:</strong> {resp.ai}
                            </div>
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message here..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatInterface;
