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
      model: 'gpt-4',
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
  const prompt = `A beautiful, artistic depiction of a ${genre} scene.`;

  try {
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    });

    res.json({ imageUrl: imageResponse.data[0].url });
  } catch (error) {
    console.error('Image Error:', error.message);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));