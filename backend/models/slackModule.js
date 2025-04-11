import { WebClient } from '@slack/web-api';

const slackToken = process.env.SLACK_BOT_TOKEN;

// console.log('token:',slackToken); 
const slackClient = new WebClient(slackToken);

// Function to check Slack for a response
export async function checkSlackForResponse(message) {
    try {
        const result = await slackClient.conversations.history({
            channel: 'C08MG7L9LN5', // Enter your channelID
            limit: 10, // Number of messages to retrieve
        });

       
        const messagesText = result.messages.map(msg => msg.text).join('\n');

        return messagesText; // Return all messages as a single string
    } catch (error) {
        console.error('Error fetching messages from Slack:', error);
        throw error; // Handle error appropriately
    }
}
