const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const HYPERBOLIC_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWdhcnZpemxhQGdtYWlsLmNvbSIsImlhdCI6MTc0MzY4OTk2N30.CyQSkjVxtdDvRGB2pV3Nx9ntoOrFvSseXnEsUxvHVuw";

app.get('/', (req, res) => {
  res.send('Hyperbolic LLaMA Story Generator API is live');
});

app.post('/api/story', async (req, res) => {
  const { genre } = req.body;
  const prompt = `Write a short, creative ${genre} story in 2-3 sentences.`;

  try {
    const response = await axios.post(
      'https://api.hyperbolic.xyz/v1/chat/completions',
      {
        model: 'meta-llama/Meta-Llama-3.1-405B-Instruct',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7,
        top_p: 0.9
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${HYPERBOLIC_API_KEY}`
        }
      }
    );

    res.json({ story: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Story Error:', error.message);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
