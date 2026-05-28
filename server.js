const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const KLING_BASE = 'https://api.klingai.com';

// Forward all /kling/* requests to Kling API
app.all('/kling/*', async (req, res) => {
  const path = req.path.replace('/kling', '');
  const url = KLING_BASE + path;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'AdForge Kling Proxy' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AdForge proxy running on port ${PORT}`));
