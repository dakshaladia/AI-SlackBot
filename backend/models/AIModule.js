import axios from 'axios';

export async function getAIResponse(prompt) {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini', 
            messages: [
                { role: 'user', content: prompt } 
            ],
            max_tokens: 150, 
            temperature: 0.7, 
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 
                'Content-Type': 'application/json',
            },
        });

        console.log('OpenAI response:', response.data); 
        return response.data.choices[0].message.content.trim(); 
    } catch (error) {
        console.error('Error getting response from OpenAI:', error);
        throw error; 
    }
}