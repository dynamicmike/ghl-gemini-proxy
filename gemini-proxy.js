const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/gemini-themes') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const requestData = JSON.parse(body);

                // Updated prompt to ask for themes and sub-themes in a structured format
                const prompt = `Based on this business information, generate 5 main content themes and for EACH main theme, generate 4 related weekly sub-themes.

Business Information:
- Business Type: ${requestData.businessType || 'Not provided'}
- Primary Product/Service: ${requestData.primaryProduct || 'Not provided'}
- Problem Solved: ${requestData.problemSolved || 'Not provided'}
- Target Audience: ${requestData.targetAudience || 'Not provided'}

Return ONLY a valid JSON array of objects with the following structure, no other text or markdown:
[
  {
    "theme": "Example Main Theme 1",
    "subthemes": ["Sub-theme 1.1", "Sub-theme 1.2", "Sub-theme 1.3", "Sub-theme 1.4"]
  },
  {
    "theme": "Example Main Theme 2",
    "subthemes": ["Sub-theme 2.1", "Sub-theme 2.2", "Sub-theme 2.3", "Sub-theme 2.4"]
  }
]`;

                const postData = JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                    }
                });

                const options = {
                    hostname: 'generativelanguage.googleapis.com',
                    port: 443,
                    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                };

                const apiReq = https.request(options, (apiRes) => {
                    let responseBody = '';
                    apiRes.on('data', chunk => { responseBody += chunk; });
                    apiRes.on('end', () => {
                        try {
                            const parsedResponse = JSON.parse(responseBody);
                            if (parsedResponse.candidates && parsedResponse.candidates[0].content) {
                                const content = parsedResponse.candidates[0].content.parts[0].text;
                                // The API should return clean JSON, so we can send it directly
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(content);
                            } else {
                                throw new Error('Invalid Gemini response structure');
                            }
                        } catch (error) {
                            console.error('Error parsing Gemini response:', error);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Failed to parse AI response' }));
                        }
                    });
                });

                apiReq.on('error', (e) => {
                    console.error('API Request Error:', e);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Gemini API request failed' }));
                });

                apiReq.write(postData);
                apiReq.end();

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request body' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Gemini proxy server running on port ${PORT}`);
});
