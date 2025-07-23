const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
        return;
    }

    // Endpoint for generating main themes
    if (req.method === 'POST' && req.url === '/gemini-themes') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const requestData = JSON.parse(body);

                // If key info is missing, send fallback immediately
                if (!requestData.businessType || !requestData.primaryProduct) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ themes: FALLBACK_THEMES }));
                }

                const prompt = `Based on this business info, generate 6 content themes for social media:
Business Type: ${requestData.businessType}
Primary Product/Service: ${requestData.primaryProduct}
Target Audience: ${requestData.targetAudience}
Content Goal: ${requestData.contentGoal}
Generate 6 specific, actionable content themes, each 3-8 words. Return ONLY a valid JSON array of 6 strings, with no other text or markdown.`;

                const postData = JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 500,
                        responseMimeType: "application/json",
                    }
                });

                const options = {
                    hostname: 'generativelanguage.googleapis.com',
                    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                };

                const apiReq = https.request(options, (apiRes) => {
                    let responseBody = '';
                    apiRes.on('data', chunk => { responseBody += chunk; });
                    apiRes.on('end', () => {
                        try {
                            const data = JSON.parse(responseBody);
                            if (data.error || !data.candidates) throw new Error(data.error?.message || 'Invalid API response');
                            
                            const themes = JSON.parse(data.candidates[0].content.parts[0].text);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ themes }));
                        } catch (error) {
                            console.error('Failed to parse Gemini themes response:', error);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ themes: FALLBACK_THEMES }));
                        }
                    });
                });

                apiReq.on('error', (error) => {
                    console.error('Gemini themes API request failed:', error);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ themes: FALLBACK_THEMES }));
                });

                apiReq.write(postData);
                apiReq.end();
            } catch (error) {
                console.error('Invalid request body for themes:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request body' }));
            }
        });
    } 
    // CORRECTED: Single, robust endpoint for sub-themes
    else if (req.method === 'POST' && req.url === '/gemini-sub-themes') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const requestData = JSON.parse(body);
                
                if (!requestData.mainTheme) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ subthemes: FALLBACK_SUBTHEMES }));
                }

                const prompt = `Based on the main theme "${requestData.mainTheme}", generate 4 weekly sub-themes.
Business Info: A ${requestData.businessType} selling ${requestData.primaryProduct} to ${requestData.targetAudience}.
Generate 4 specific weekly sub-themes that break down the main theme. Each should be a short phrase.
Return ONLY a valid JSON array of 4 strings, with no other text or markdown.`;

                const postData = JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 300,
                        responseMimeType: "application/json",
                    }
                });

                const options = {
                    hostname: 'generativelanguage.googleapis.com',
                    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                };

                const apiReq = https.request(options, (apiRes) => {
                    let responseBody = '';
                    apiRes.on('data', chunk => { responseBody += chunk; });
                    apiRes.on('end', () => {
                        try {
                            const data = JSON.parse(responseBody);
                             if (data.error || !data.candidates) throw new Error(data.error?.message || 'Invalid API response');

                            const subthemes = JSON.parse(data.candidates[0].content.parts[0].text);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ subthemes }));
                        } catch (error) {
                            console.error('Failed to parse Gemini sub-themes response:', error);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ subthemes: FALLBACK_SUBTHEMES }));
                        }
                    });
                });

                apiReq.on('error', (error) => {
                    console.error('Gemini sub-themes API request failed:', error);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ subthemes: FALLBACK_SUBTHEMES }));
                });

                apiReq.write(postData);
                apiReq.end();
            } catch (error) {
                console.error('Invalid request body for sub-themes:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request body' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Gemini proxy server running on port ${PORT}`);
});
