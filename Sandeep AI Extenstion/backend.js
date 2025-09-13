document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const clearBtn = document.getElementById('clearBtn');
    const responseDiv = document.getElementById('response');
    const statusDiv = document.getElementById('status');
    const buttonText = document.getElementById('buttonText');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // API configuration - Using Groq's Llama 3
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const API_KEY = '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'; // Replace with your Groq API key
    
    const MODEL_NAME = 'llama-3.1-8b-instant';

    userInput.focus();

    userInput.addEventListener('input', function() {
        sendBtn.disabled = userInput.value.trim() === '';
    });

    // Clear functionality
    clearBtn.addEventListener('click', function() {
        userInput.value = '';
        responseDiv.textContent = '';
        statusDiv.textContent = '';
        sendBtn.disabled = true;
        userInput.focus();
    });

    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) {
                sendBtn.click();
            }
        }
    });

    // API call function
    async function queryAI(prompt) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [{
                    role: "user",
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 2000,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Send button click handler
    sendBtn.addEventListener('click', async function() {
        const question = userInput.value.trim();
        if (!question) return;

        // Show loading
        sendBtn.disabled = true;
        buttonText.style.display = 'none';
        loadingIndicator.style.display = 'inline-block';
        statusDiv.textContent = 'Thinking...';

        try {
            const answer = await queryAI(question);
            responseDiv.textContent = answer;
            statusDiv.textContent = 'Response received';
            userInput.value = '';
        } catch (error) {
            console.error('Error:', error);
            responseDiv.textContent = `Error: ${error.message}`;
            statusDiv.textContent = 'Failed to get response';
            
            // If it's an API key error, show how to get one
            if (error.message.includes('401')) {
                responseDiv.textContent += '\n\nGet a free API key from: https://console.groq.com/keys';
            }
        } finally {
            // Reset UI
            sendBtn.disabled = false;
            buttonText.style.display = 'inline';
            loadingIndicator.style.display = 'none';
        }
    });
});
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = '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'; // Replace with your Groq API key

async function getLlamaResponse(userMessage) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

