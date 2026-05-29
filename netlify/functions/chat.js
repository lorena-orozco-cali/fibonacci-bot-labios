const https = require("https");
exports.handler = async function(event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  try {
    const { messages, system } = JSON.parse(event.body);
    const payload = JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 500, system: system, messages: messages });
    const result = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: "api.anthropic.com", path: "/v1/messages", method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "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", "anthropic-version": "2023-06-01", "Content-Length": Buffer.byteLength(payload) }
      }, (res) => { let d=""; res.on("data",(c)=>d+=c); res.on("end",()=>resolve(d)); });
      req.on("error", reject); req.write(payload); req.end();
    });
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: result };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
