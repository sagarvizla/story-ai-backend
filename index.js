const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get('/', (req, res) => {
  res.send('Welcome to the Story & Visual Generator API');
});

app.post('/api/story', async (req, res) => {
  const { genre } = req.body;
  const prompt = `Write a short, creative ${genre} story in 2-3 sentences.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ story: response.choices[0].message.content });
  } catch (error) {
    console.error('Story Error:', error.message);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

app.post('/api/image', async (req, res) => {
  const { genre } = req.body;

  const placeholders = {
    fantasy: 'https://placehold.co/512x512/8B4513/FFF?text=Fantasy+Scene',
    'sci-fi': 'https://placehold.co/512x512/000080/FFF?text=Sci-Fi+Scene',
    mystery: 'https://placehold.co/512x512/2F4F4F/FFF?text=Mystery+Scene',
    adventure: 'https://placehold.co/512x512/228B22/FFF?text=Adventure+Scene',
  };

  const placeholderUrl = placeholders[genre] || 'https://placehold.co/512x512?text=Unknown+Genre';
  res.json({ imageUrl: placeholderUrl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));