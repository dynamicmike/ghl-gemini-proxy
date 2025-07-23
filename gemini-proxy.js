const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// IMPORTANT: Add your GHL API Key to your environment variables
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

    // --- NEW: GHL Contact Fetching Endpoint ---
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

                /* // --- REAL GHL API CALL ---
                // This is where you would call the GHL API.
                // You would replace the mock data below with this live fetch call.
                
                const ghlApiUrl = `https://rest.gohighlevel.com/v1/contacts/lookup?email=${email}`;
                const options = {
                    headers: { 'Authorization': `Bearer ${GHL_API_KEY}` }
                };
                const ghlResponse = await fetch(ghlApiUrl, options);
                if (!ghlResponse.ok) {
                    throw new Error('Failed to fetch contact from GHL');
                }
                const ghlData = await ghlResponse.json();
                const contactData = ghlData.contacts[0]; // Assuming the first result is the correct one
                
                // You would then map GHL custom fields to your form fields
                const responseData = {
                    businessType: contactData.customFields.find(f => f.name === 'Business Type')?.value || '',
                    primaryProduct: contactData.customFields.find(f => f.name === 'Primary Product')?.value || '',
                    // ... map all other fields
                };

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData));
                */

                // --- MOCK GHL DATA (for demonstration) ---
                // This simulates a successful response from GHL for a known user.
                console.log(`Simulating GHL data fetch for: ${email}`);
                if (email === 'user@example.com') {
                    const mockContactData = {
                        businessType: "E-commerce",
                        primaryProduct: "Handmade Jewelry",
                        problemSolved: "Finding unique, affordable gifts.",
                        targetAudience: "Women aged 20-40",
                        contentGoal: "Increase Engagement",
                        // Add any other fields you want to pre-populate
                    };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(mockContactData));
                } else {
                    // If the user is new, return an empty object
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

    // --- Gemini API Endpoints (Unchanged) ---
    if (req.method === 'POST' && (requestUrl === '/gemini-themes' || requestUrl === '/gemini-sub-themes')) {
        // ... previous Gemini logic remains here ...
    }

    // Health check and 404
    if (req.method === 'GET' && requestUrl === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    } else if (req.method !== 'POST') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Gemini proxy server running on port ${PORT}`);
});
