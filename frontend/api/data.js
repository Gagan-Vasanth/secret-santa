import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'public/data/users.json');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Read data from file
      const fileData = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      const data = JSON.parse(fileData);
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      // Save data to file
      const newData = req.body;
      
      // Validate data structure
      if (!newData || !newData.users || !Array.isArray(newData.users)) {
        return res.status(400).json({ error: 'Invalid data structure' });
      }

      // Write to file
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(newData, null, 2));
      
      return res.status(200).json({ success: true, message: 'Data saved successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}