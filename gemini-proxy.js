/*
* =================================================================
* GHL-GEMINI-PROXY SERVER
* =================================================================
* This Node.js server acts as a secure backend for your form.
*
* Required Environment Variables:
* - GHL_API_KEY: Your GoHighLevel Agency API Key.
* - GEMINI_API_KEY: Your Google Gemini API Key.
* - PORT: The port for the server to run on (e.g., 3001).
* =================================================================
*/
const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GHL_API_KEY = process.env.GHL_API_KEY;

// Define fallback data in one place for easy maintenance
const FALLBACK_THEMES = [
    "Expert Tips & Insights",
    "Behind the Scenes Content",
    "Customer Success Stories",
    "Industry Trends & Updates",
    "Problem-Solution Focus",
    "Educational Content Series"
];

const FALLBACK_SUBTHEMES = [
    "Week 1: Foundational Concepts",
    "Week 2: Practical Applications",
    "Week 3: Common Mistakes to Avoid",
    "Week 4: Advanced Strategies"
];

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const requestUrl = url.parse(req.url).pathname;

    // --- GHL MEMBERSHIP AUTHENTICATION ENDPOINT ---
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
                
                const ghlAuthUrl = 'https://services.leadconnectorhq.com/courses/auth/login';
                const response = await fetch(ghlAuthUrl, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Version': '2021-07-28' 
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const responseData = await response.json();

                if (response.ok && responseData.contact) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Login successful' }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: responseData.message || 'Invalid credentials' }));
                }
                */

                // --- MOCK AUTHENTICATION (for testing) ---
                // This block allows you to test the form flow without live credentials.
                // Remove or comment out this block when you go live with the real logic above.
                console.log(`Simulating GHL Membership login for: ${email}`);
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
    }

    // --- GHL CONTACT DATA FETCHING ENDPOINT ---
    else if (req.method === 'POST' && requestUrl === '/api/get-contact-data') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const { email } = JSON.parse(body);
                if (!email) {
                    return res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Email is required' }));
                }

                /*
                // --- REAL GHL API CALL ---
                // Replace the mock logic below with this block for production.
                
                const ghlApiUrl = `https://rest.gohighlevel.com/v1/contacts/lookup?email=${encodeURIComponent(email)}`;
                const options = {
                    headers: { 'Authorization': `Bearer ${GHL_API_KEY}` }
                };
                const ghlResponse = await fetch(ghlApiUrl, options);

                if (!ghlResponse.ok) throw new Error('Failed to fetch contact from GHL');
                
                const ghlData = await ghlResponse.json();
                const contact = ghlData.contacts[0];
                
                if (!contact) {
                    // No contact found, return empty object
                    return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({}));
                }
                
                // Map GHL custom fields to your form fields
                const responseData = {
                    businessType: contact.customFields?.find(f => f.name === 'Business Type')?.value || '',
                    primaryProduct: contact.customFields?.find(f => f.name === 'Primary Product')?.value || '',
                    // ... map all other custom fields here ...
                };

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData));
                */

                // --- MOCK GHL DATA (for testing) ---
                if (email === 'user@example.com') {
                    const mockContactData = {
                        businessType: "E-commerce",
                        primaryProduct: "Handmade Jewelry",
                        problemSolved: "Finding unique, affordable gifts.",
                        targetAudience: "Women aged 20-40",
                        contentGoal: "Increase Engagement",
                        platforms: ["Instagram", "Pinterest"]
                    };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(mockContactData));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({}));
                }
            } catch (error) {
                console.error('Error fetching GHL data:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Server error while fetching contact data.' }));
            }
        });
    }

    // --- GEMINI AI THEME GENERATION ENDPOINT ---
    else if (req.method === 'POST' && requestUrl === '/gemini-themes') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const requestData = JSON.parse(body);
                if (!requestData.businessType || !requestData.primaryProduct) {
                    return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ themes: FALLBACK_THEMES }));
                }

                const prompt = `Based on this business info, generate 6 content themes for social media:
Business Type: ${requestData.businessType}
Primary Product/Service: ${requestData.primaryProduct}
Target Audience: ${requestData.targetAudience}
Content Goal: ${requestData.contentGoal}
Generate 6 specific, actionable content themes, each 3-8 words. Return ONLY a valid JSON array of 6 strings, with no other text or markdown.`;

                // Gemini API call logic here...

            } catch (error) {
                console.error('Invalid request body for themes:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Invalid request body' }));
            }
        });
    }

    // --- GEMINI AI SUB-THEME GENERATION ENDPOINT ---
    else if (req.method === 'POST' && requestUrl === '/gemini-sub-themes') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const requestData = JSON.parse(body);
                if (!requestData.mainTheme) {
                    return res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ subthemes: FALLBACK_SUBTHEMES }));
                }

                const prompt = `Based on the main theme "${requestData.mainTheme}", generate 4 weekly sub-themes.
Business Info: A ${requestData.businessType} selling ${requestData.primaryProduct} to ${requestData.targetAudience}.
Generate 4 specific weekly sub-themes that break down the main theme. Each should be a short phrase.
Return ONLY a valid JSON array of 4 strings, with no other text or markdown.`;

                // Gemini API call logic here...

            } catch (error) {
                console.error('Invalid request body for sub-themes:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Invalid request body' }));
            }
        });
    }
    
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Gemini proxy server running on port ${PORT}`);
});
