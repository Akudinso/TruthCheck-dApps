import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { factCheckText } from './factCheckScript.js';
import dotenv from 'dotenv';
import { storeFactCheck, getFactCheck } from './smartContract.js'; 

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

    // Step 2: Store the fact check result on-chain
    const txHash = await storeFactCheck(content, JSON.stringify(factCheckResult));
    res.status(200).json({ fact_check_result: factCheckResult, transaction_hash: txHash,
    });
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

app.post('/get-fact-check', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'No content provided' });
  }

  try {
    const [result, timestamp] = await getFactCheck(content);

    // If result is an empty string, it means the content hasn't been fact-checked yet
    if (!result) {
      return res.status(404).json({ error: 'Fact check result not found for this content' });
    }

    res.status(200).json({
      fact_check_result: result,
      stored_at: new Date(Number(timestamp) * 1000).toISOString(), // convert unix timestamp
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});