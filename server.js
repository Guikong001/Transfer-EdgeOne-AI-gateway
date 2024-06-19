const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const config = {
    oeKey: process.env.OE_KEY,  
    oeGatewayName: process.env.OE_GATEWAY_NAME,  
    oeAIProvider: process.env.OE_AI_PROVIDER  
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/v1/chat/completions', async (req, res) => {
    const gatewayUrl = 'https://ai-gateway.eo-edgefunctions7.com/v1/chat/completions';

    console.log('Received request with body:', JSON.stringify(req.body, null, 2));
    console.log('Received request with headers:', JSON.stringify(req.headers, null, 2));

    axios({
        method: 'post',
        url: gatewayUrl,
        data: req.body,
        headers: {
            'Authorization': req.headers['authorization'],
            'Content-Type': 'application/json',
            'OE-Key': config.oeKey,
            'OE-Gateway-Name': config.oeGatewayName,
            'OE-AI-Provider': config.oeAIProvider
        },
        responseType: 'stream'
    }).then(response => {
        let fullResponse = '';
        response.data.on('data', (chunk) => {
            fullResponse += chunk.toString();
            res.write(chunk);
        });
        response.data.on('end', () => {
            console.log('Complete response received:', fullResponse);
            res.end();
        });
    }).catch(error => {
        console.error('Error forwarding request:', error);
        res.status(500).send('Error processing your request');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// 导出应用以便 Vercel 处理
module.exports = app;
