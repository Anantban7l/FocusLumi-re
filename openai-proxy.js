// Simple Node.js proxy for OpenAI API
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Replace with your OpenAI API key
const OPENAI_API_KEY = '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';

app.post('/openai', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    if (!response.ok) {
      // Log and return OpenAI error details
      console.error('OpenAI API error:', data);
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (err) {
    console.error('Proxy server error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`OpenAI proxy server running on http://localhost:${PORT}`);
});
