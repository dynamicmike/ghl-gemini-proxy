const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GHL_API_KEY = process.env.GHL_API_KEY; 

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const requestUrl = url.parse(req.url).pathname;

    // --- REAL GHL AUTHENTICATION ENDPOINT ---
    if (req.method === 'POST' && requestUrl === '/api/login') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const { email, password } = JSON.parse(body);

                /*
                // --- REAL GHL MEMBERSHIP AUTHENTICATION ---
                // Replace the mock logic below with this block for production.
                // You may need to consult GHL API docs for the exact URL and body.
                
                const ghlAuthUrl = 'https://services.leadconnectorhq.com/courses/auth/login'; // Example URL
                const response = await fetch(glAuthUrl, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Version': '2021-07-28' 
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.status === 200) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Login successful' }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid credentials' }));
                }
                */

                // --- MOCK AUTHENTICATION (for demonstration) ---
                console.log(`Simulating GHL login for: ${email}`);
                if (email === 'user@example.com' && password === 'password123') {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Login successful' }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid email or password' }));
                }
                
            } catch (error) {
                console.error('Login error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Server error during login' }));
            }
        });
        return;
    }
    
    // --- GHL Contact Fetching Endpoint ---
    if (req.method === 'POST' && requestUrl === '/api/get-contact-data') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const { email } = JSON.parse(body);
                if (!email) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Email is required' }));
                }
                
                // --- MOCK GHL DATA (for demonstration) ---
                if (email === 'user@example.com') {
                    const mockContactData = {
                        businessType: "E-commerce",
                        primaryProduct: "Handmade Jewelry",
                        problemSolved: "Finding unique, affordable gifts.",
                        targetAudience: "Women aged 20-40",
                        contentGoal: "Increase Engagement",
                    };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(mockContactData));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({}));
                }

            } catch (error) {
                console.error('Error fetching GHL data:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Server error while fetching contact data.' }));
            }
        });
        return;
    }

    // --- Gemini API Endpoints ---
    if (req.method === 'POST' && (requestUrl === '/gemini-themes' || requestUrl === '/gemini-sub-themes')) {
        // Your existing, corrected Gemini logic would be here.
        // For brevity in this example, it's omitted, but it should be included in your final file.
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ themes: ["Fallback Theme 1", "Fallback Theme 2"] })); // Placeholder
        return;
    }

    // Health check and 404
    if (req.method === 'GET' && requestUrl === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Gemini proxy server running on port ${PORT}`);
});
