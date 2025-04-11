import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SlackMessage {
    _id: string;
    user: string;
    text: string;
    timestamp: string;
    channelId: string,
}

interface SlackMessageSummaryProps {
    channelId: string;
}

const SlackMessageSummary: React.FC<SlackMessageSummaryProps> = ({ channelId }) => {
    const [messages, setMessages] = useState<SlackMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/slack/messages/${channelId}`);
                setMessages(response.data);
            } catch (err) {
                setError('Failed to fetch messages');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [channelId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    return (
        <div>
            <h1>Messages for Channel: {channelId}</h1>
            <ul>
                {messages.map((msg) => (
                    <li key={msg._id}>{msg.text}</li>
                ))}
            </ul>
        </div>
    );
};

export default SlackMessageSummary;
