const mongoose = require('mongoose');

const SlackMessageSchema = new mongoose.Schema({
    // _id: { type: String, required: true },
    user: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: String, required: true },
    channelId: { type: String, required: true },
});

const SlackMessage = mongoose.model('SlackMessage', SlackMessageSchema,'slackmessages');

module.exports = SlackMessage;
