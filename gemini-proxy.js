// gemini-proxy.js

import http from 'http';
import url from 'url';
import fetch from 'node-fetch';

// 1. Validate required environment variables
const { GEMINI_API_KEY, GHL_API_KEY, PORT = 3001 } = process.env;
if (!GEMINI_API_KEY) {
  console.error('❌ Missing GEMINI_API_KEY');
  process.exit(1);
}
if (!GHL_API_KEY) {
  console.error('❌ Missing GHL_API_KEY');
  process.exit(1);
}

// 2. Common CORS & response headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Content-Type': 'application/json'
};

// 3. Safe JSON parser helper
function parseJsonOr400(raw, res) {
  try {
    return JSON.parse(raw);
  } catch {
    res.writeHead(400, headers);
    res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
    return null;
  }
}

// 4. Request handler
async function handler(req, res) {
  const { method } = req;
  const path = url.parse(req.url).pathname;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, headers);
    return res.end();
  }

  // Collect request body
  let chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', async () => {
    const body = Buffer.concat(chunks).toString();

    try {
      switch (path) {
        // Health check
        case '/health':
          res.writeHead(200, headers);
          return res.end(JSON.stringify({ status: 'ok' }));

        // Simple auth/login mock
        case '/api/auth/login': {
          const payload = parseJsonOr400(body, res);
          if (!payload) return;
          const { username, password } = payload;
          if (username === 'admin' && password === 'password') {
            res.writeHead(200, headers);
            return res.end(JSON.stringify({ token: 'fake-jwt-token' }));
          } else {
            res.writeHead(401, headers);
            return res.end(JSON.stringify({ error: 'Invalid credentials' }));
          }
        }

        // Gemini API proxy
        case '/api/gemini': {
          const payload = parseJsonOr400(body, res);
          if (!payload) return;
          try {
            const geminiRes = await fetch(
              'https://api.gemini.example.com/v1/themes',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${GEMINI_API_KEY}`
                },
                body: JSON.stringify(payload)
              }
            );
            const data = await geminiRes.json();
            res.writeHead(geminiRes.status, headers);
            return res.end(JSON.stringify(data));
          } catch (err) {
            console.error('Gemini proxy error:', err);
            res.writeHead(502, headers);
            return res.end(JSON.stringify({ error: 'Bad Gateway to Gemini' }));
          }
        }

        // GHL form submission proxy
        case '/api/submit-form': {
          const formData = parseJsonOr400(body, res);
          if (!formData) return;
          try {
            const ghlRes = await fetch(
              'https://api.gohighlevel.com/v1/forms',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${GHL_API_KEY}`
                },
                body: JSON.stringify(formData)
              }
            );
            const result = await ghlRes.json();
            res.writeHead(ghlRes.status, headers);
            return res.end(JSON.stringify(result));
          } catch (err) {
            console.error('GHL form proxy error:', err);
            res.writeHead(502, headers);
            return res.end(JSON.stringify({ error: 'Bad Gateway to GHL' }));
          }
        }

        // Not found
        default:
          res.writeHead(404, headers);
          return res.end(JSON.stringify({ error: 'Not Found' }));
      }
    } catch (err) {
      console.error('Server error:', err);
      res.writeHead(500, headers);
      return res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  });
}

// 5. Create and start HTTP server
const server = http.createServer(handler);
server.listen(PORT, () => {
  console.log(`🔌 Proxy server listening on port ${PORT}`);
});
