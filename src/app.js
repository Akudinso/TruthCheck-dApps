import express from 'express';
import cors from 'cors';
import { factCheckText } from './factCheckScript.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON body

app.post('/fact-check', (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'No content provided' });
  }

  try {
    const factCheckResult = factCheckText(content);
    res.status(200).json({ fact_check_result: factCheckResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
