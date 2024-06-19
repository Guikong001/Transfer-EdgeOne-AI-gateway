# Transfer-EdgeOne-AI-gateway
一个node.js服务，用于在AI请求头中添加Tencent的EdgeOne所需要的鉴权请求头。

## EdgeOne AI网关
边缘安全加速平台EO基于Tencent边缘计算节点提供加速和安全的解决方案，目前推出了类似于Cloudflare AIgateway的AI网关功能，目前已经支持了较多不同的语言模型提供商，比较值得注意的是其支持OpenAI模型的调用。

官方给到的测试命令如下，可以看到在调用的基础上增加了几个用于EdgeOne调用的请求头信息。为了在NextChat等其他应用中通过EdgeOne网关实现对OpenAI模型的调用，可以通过额外增加请求头的方式来实现相关功能。
    curl -X POST "https://xxxxxx/v1/chat/completions" \
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
    }'
