const cluster = require('cluster');
const totalCPUs = require('os').cpus().length;

// 配置信息
const config = {
    oeKey: process.env.OE_KEY,  //替换为你的EdgeOne网关的Key
    oeGatewayName: process.env.OE_GATEWAY_NAME,  //替换为你的EdgeOne网关的名称
    oeAIProvider: process.env.OE_AI_PROVIDER  //替换为你需要调用的AI模型的提供商
};

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // 增加多线程支持
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    const express = require('express');
    const axios = require('axios');  //用于处理流式相应
    const bodyParser = require('body-parser');
    const app = express();
    const PORT = process.env.PORT;

    app.use(bodyParser.json());

    app.post('/v1/chat/completions', async (req, res) => {
        const gatewayUrl = 'https://ai-gateway.eo-edgefunctions7.com/v1/chat/completions'; //这里是EdgeOne网关的地址，有可能会有变化，根据实际情况修改

        console.log(`Worker ${process.pid} handling request`);
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
                res.write(chunk); // 将数据块实时回传给请求端
            });
            response.data.on('end', () => {
                console.log('Complete response received:', fullResponse); // 流结束时打印完整的响应
                res.end();
            });
        }).catch(error => {
            console.error('Error forwarding request:', error);
            res.status(500).send('Error processing your request');
        });
    });

    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started`);
    });
}
