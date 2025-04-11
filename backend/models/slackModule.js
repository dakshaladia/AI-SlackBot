import { WebClient } from '@slack/web-api';

// const slackToken = process.env.SLACK_BOT_TOKEN;
const slackToken="xoxb-8721745496884-8730587885169-rBIb3rBOFeLbCs2FnHROUiaA"

// console.log('token:',slackToken); // Your Slack bot token
const slackClient = new WebClient(slackToken);

// Function to check Slack for a response
export async function checkSlackForResponse(message) {
    try {
        const result = await slackClient.conversations.history({
            channel: 'C08MG7L9LN5', // Your channel ID
            limit: 10, // Number of messages to retrieve
        });

        // Gather the text of the messages
        const messagesText = result.messages.map(msg => msg.text).join('\n');

        // Return the concatenated messages for AI processing
        return messagesText; // Return all messages as a single string
    } catch (error) {
        console.error('Error fetching messages from Slack:', error);
        throw error; // Handle error appropriately
    }
}
