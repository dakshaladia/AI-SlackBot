import React from 'react';
import './App.css';
import ChatInterface from './ChatInterface';

const App: React.FC = () => {

  return (
    <div className="App">
      
        <h1>Smart Slack bot chat application</h1>
        <div className="ChatContainer">
        <ChatInterface />
      </div>
    </div>
  );
};

export default App;