import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SlackMessage from './models/SlackMessage.js'; 
import multer from 'multer'; 
import cors from 'cors'; // Import cors
import bodyParser from 'body-parser';
import { getAIResponse } from './models/AIModule.js'; 
import { checkSlackForResponse } from './models/slackModule.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(bodyParser.json()); 

// Slack Events Endpoint
app.post('/slack/events', (req, res) => {
    const { type, challenge } = req.body;

    // URL verification for Slack
    if (type === 'url_verification') {
        return res.status(200).send(challenge); 
    }

    // Handle other event types (e.g., message events)
    if (type === 'event_callback') {
        const event = req.body.event;

        // Process the event (e.g., respond to messages)
        console.log('Received event:', event);
        // Save the message to the database
        const slackMessage = new SlackMessage({
            user: event.user,
            text: event.text,
            timestamp: event.ts,
            channelId: event.channel
        });

        slackMessage.save()
            .then(() => console.log('Message saved to MongoDB'))
            .catch(err => console.error('Error saving message:', err));

        return res.sendStatus(200);
    }

    // If the event type is not recognized
    return res.sendStatus(400);
});



app.post('/upload', multer({ dest: 'uploads/' }).single('file'), (req, res) => {
    // Handle file processing
    res.send('File uploaded successfully');
});
//C08MG7L9LN5
// Endpoint to get summarized Slack messages
app.get('/api/slack/messages/:channelId', async (req, res) => {
    const channelId = req.params.channelId;
    console.log('Received channelId:', channelId); // Log the channelId
    try {
        const messages = await SlackMessage.find({ channelId: channelId });
        console.log('Fetched messages:', messages); // Log the fetched messages
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Server error');
    }
});

// Define an API endpoint to handle chat messages
app.post('/api/chat', async (req, res) => {
    const { message } = req.body; // Extract the message from the request body

    if (!message) {
        return res.status(400).json({ error: 'Message is required' }); // Handle missing message
    }

    try {
        // Check Slack for relevant messages
        const slackMessages = await checkSlackForResponse(message);

        // Use AI to generate a response based on the retrieved Slack messages
        const aiResponse = await getAIResponse(`Based on the following messages:\n${slackMessages}\n\nUser's query: ${message}`);

        return res.json({ response: aiResponse }); // Return the AI-generated response
    } catch (error) {
        console.error('Error processing message:', error);
        return res.status(500).json({ error: 'Failed to process message', details: error.message }); // Return error details
    }
});

// Add this route to your existing server.js file
app.get('/', (req, res) => {
    res.send('Welcome to the Slack GPT Dashboard API!');
});

// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error(err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});