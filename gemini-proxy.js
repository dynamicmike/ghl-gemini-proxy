const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
        return;
    }

    if (req.method === 'POST' && req.url === '/gemini-themes') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const requestData = JSON.parse(body);
                
                // Provide fallback themes if data is missing or API fails
                if (!requestData.businessType && !requestData.primaryProduct) {
                    const fallbackThemes = [
                        "Expert Tips & Insights",
                        "Behind the Scenes Content", 
                        "Customer Success Stories",
                        "Industry Trends & Updates",
                        "Problem-Solution Focus",
                        "Educational Content Series"
                    ];
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ themes: fallbackThemes }));
                    return;
                }

                const prompt = `Based on this business information, generate 6 highly relevant content themes for social media marketing:

Business Type: ${requestData.businessType || 'Business'}
Primary Product/Service: ${requestData.primaryProduct || 'Service'}
Problem Solved: ${requestData.problemSolved || 'Customer problems'}
Target Audience: ${requestData.targetAudience || 'Target customers'}
Content Goal: ${requestData.contentGoal || 'Engagement'}

Generate 6 specific, actionable content themes. Each theme should be 3-8 words and directly relevant to their industry.

Return ONLY a JSON array of 6 theme strings, no other text.`;

                const postData = JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 500
                    }
                });

                const options = {
                    hostname: 'generativelanguage.googleapis.com',
                    port: 443,
                    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(postData)
                    }
                };

                const apiReq = https.request(options, (apiRes) => {
                    let responseBody = '';
                    
                    apiRes.on('data', chunk => {
                        responseBody += chunk;
                    });

                    apiRes.on('end', () => {
                        try {
                            console.log('Gemini API Response:', responseBody);
                            const data = JSON.parse(responseBody);
                            
                            // Check for API errors first
                            if (data.error) {
                                console.error('Gemini API Error:', data.error);
                                throw new Error(`Gemini API Error: ${data.error.message || 'Unknown error'}`);
                            }
                            
                            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                                console.error('Invalid Gemini response structure:', data);
                                throw new Error('Invalid Gemini response structure');
                            }
                            
                            const content = data.candidates[0].content.parts[0].text;
                            console.log('Gemini content:', content);
                            
                            // Extract JSON from response or use fallback
                            const jsonMatch = content.match(/\[[\s\S]*?\]/);
                            if (jsonMatch) {
                                // Clean the JSON string to handle potential formatting issues
                                const cleanJson = jsonMatch[0]
                                    .replace(/```json/g, '')
                                    .replace(/```/g, '')
                                    .replace(/\n/g, ' ')
                                    .trim();
                                const themes = JSON.parse(cleanJson);
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ themes }));
                            } else {
                                // Fallback themes if parsing fails
                                console.log('Using fallback themes due to parsing failure');
                                const fallbackThemes = [
                                    "Expert Tips & Insights",
                                    "Behind the Scenes Content", 
                                    "Customer Success Stories",
                                    "Industry Trends & Updates",
                                    "Problem-Solution Focus",
                                    "Educational Content Series"
                                ];
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ themes: fallbackThemes }));
                            }
                        } catch (error) {
                            console.error('Full error details:', error);
                            // Return fallback themes instead of error
                            const fallbackThemes = [
                                "Expert Tips & Insights",
                                "Behind the Scenes Content", 
                                "Customer Success Stories",
                                "Industry Trends & Updates",
                                "Problem-Solution Focus",
                                "Educational Content Series"
                            ];
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ themes: fallbackThemes }));
                        }
                    });
                });

                apiReq.on('error', (error) => {
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
    } else if (req.method === 'POST' && req.url === '/gemini-subthemes') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const requestData = JSON.parse(body);
                
                const prompt = `Based on this main theme and business information, generate 4 weekly sub-themes:

Main Theme: ${requestData.mainTheme}
Business Type: ${requestData.businessType}
Primary Product/Service: ${requestData.primaryProduct}
Target Audience: ${requestData.targetAudience}

Generate 4 specific weekly sub-themes that break down the main theme into actionable weekly focuses. Each should be formatted as "Week X: [Specific Focus]" and be directly relevant to their business and the main theme.

Return ONLY a JSON array of 4 sub-theme strings, no other text.`;

                const postData = JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 300
                    }
                });

                const options = {
                    hostname: 'generativelanguage.googleapis.com',
                    port: 443,
                    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(postData)
                    }
                };

                const apiReq = https.request(options, (apiRes) => {
                    let responseBody = '';
                    
                    apiRes.on('data', chunk => {
                        responseBody += chunk;
                    });

                    apiRes.on('end', () => {
                        try {
                            const data = JSON.parse(responseBody);
                            const content = data.candidates[0].content.parts[0].text;
                            
                            // Extract JSON from response
                            const jsonMatch = content.match(/\[.*?\]/s);
                            if (jsonMatch) {
                                const subthemes = JSON.parse(jsonMatch[0]);
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ subthemes }));
                            } else {
                                throw new Error('Unable to parse sub-themes from Gemini response');
                            }
                        } catch (error) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Failed to parse AI response' }));
                        }
                    });
                });

                apiReq.on('error', (error) => {
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
    } else if (req.method === 'POST' && req.url === '/gemini-sub-themes') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const requestData = JSON.parse(body);
                
                // Generate sub-themes based on selected main theme
                const fallbackSubThemes = [
                    "Weekly Tips Monday",
                    "Tutorial Tuesday", 
                    "Success Story Wednesday",
                    "Behind Scenes Thursday",
                    "FAQ Friday",
                    "Weekend Inspiration",
                    "Monthly Review",
                    "Client Spotlight"
                ];
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ subthemes: fallbackSubThemes }));
            } catch (error) {
                const fallbackSubThemes = [
                    "Weekly Tips Monday",
                    "Tutorial Tuesday", 
                    "Success Story Wednesday",
                    "Behind Scenes Thursday",
                    "FAQ Friday",
                    "Weekend Inspiration",
                    "Monthly Review",
                    "Client Spotlight"
                ];
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ subthemes: fallbackSubThemes }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Gemini proxy server running on port ${PORT}`);
});