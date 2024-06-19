# Transfer-EdgeOne-AI-gateway

一个node.js服务，用于在AI请求头中添加Tencent的EdgeOne所需要的鉴权请求头。

## EdgeOne AI网关

边缘安全加速平台EO基于Tencent边缘计算节点提供加速和安全的解决方案，目前推出了类似于Cloudflare AIgateway的AI网关功能，目前已经支持了较多不同的语言模型提供商，比较值得注意的是其支持OpenAI模型的调用。

官方给到的测试命令如下，可以看到在调用的基础上增加了几个用于EdgeOne调用的请求头信息。为了在NextChat等其他应用中通过EdgeOne网关实现对OpenAI模型的调用，可以通过额外增加请求头的方式来实现相关功能。

<br/>

`    curl -X POST "https://xxxxxx/v1/chat/completions" \
     -H 'Authorization: Bearer XXXXXXXXXX' \
     -H 'Content-Type: application/json' \
     -H 'OE-Key: xxxxxxxxxxxxxxxxxxx' \
     -H 'OE-Gateway-Name: xxxxxxxxxxxxxxxxxx' \
     -H 'OE-AI-Provider: openai' \
     -d '{
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "你是一位富有诗意的助手，擅长以创造性的天赋解释复杂的编程概念。"
        },
        {
          "role": "user",
          "content": "写一首诗来解释编程中递归的概念。"
        }
      ]
    }'`

## 部署方法

### 自有服务器部署

1. 安装node.js
2. 创建node.js项目

`mkdir eo-ai-gateway`

`cd eo-ai-gateway`

`npm init -y`

`npm install express axios body-parser --save`

3. 创建server.js

`vim server.js`

将仓库中的server-host.js的内容复制进去。

将第6-8行的变量设置为自己的EdgeOne AI网关的参数。第27行设置监听端口为7382，可以根据自身需求修改。

4. 完成后，保存server.js，然后运行

`node server.js`

5. 随后可以测试，直接将接入点设置为 http://localhost:7382 (或者http://ip:7382)  即可测试调用。
   
   <br/>

### Vercel部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/Guikong001/Transfer-EdgeOne-AI-gateway)

使用Vercel部署后，设置环境变量

#### OE_KEY

替换为你的EdgeOne网关的Key

#### OE_GATEWAY_NAME

替换为你的EdgeOne网关的名称

#### OE_AI_PROVIDER

替换为你需要调用的AI模型的提供商
