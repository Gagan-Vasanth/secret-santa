import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DATA_FILE_PATH = path.join(__dirname, 'public/data/users.json');

// GET /api/data - Read data
app.get('/api/data', (req, res) => {
  try {
    const fileData = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    const data = JSON.parse(fileData);
    res.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to read data', details: error.message });
  }
});

// POST /api/data - Save data
app.post('/api/data', (req, res) => {
  try {
    const newData = req.body;
    
    // Validate data structure
    if (!newData || !newData.users || !Array.isArray(newData.users)) {
      return res.status(400).json({ error: 'Invalid data structure' });
    }

    // Write to file
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(newData, null, 2));
    
    console.log('Data saved successfully');
    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Development API server running on http://localhost:${PORT}`);
  console.log(`📁 Data file: ${DATA_FILE_PATH}`);
});