import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { factCheckText } from './factCheckScript.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/fact-check', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'No content provided' });
  }

  try {
    const factCheckResult = await factCheckText(content);
    res.status(200).json({ fact_check_result: factCheckResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/extract-text', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    const response = await axios.post(
      'https://twitter.tikvid.xyz/extract-text',
      { url },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    res.status(200).json({ text: response.data.text });
  } catch (err) {
    console.error('Extraction error:', err);
    
    if (err.response) {
      res.status(502).json({ 
        error: 'External service error',
        details: err.response.data 
      });
    } else if (err.request) {
      res.status(504).json({ 
        error: 'External service unavailable' 
      });
    } else {
      res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
      });
    }
  }
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});