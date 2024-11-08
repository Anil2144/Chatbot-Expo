// proxyServer.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 5001;

// Enable CORS for all origins
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Proxy endpoint for raising an incident
app.post("/api/raiseIncident", async (req, res) => {
  const serviceNowApiUrl = "https://dev193610.service-now.com/api/now/table/incident";
  const username = "admin";
  const password = "2C%qFtB1nnY%";

  try {
    const response = await fetch(serviceNowApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(username + ":" + password).toString("base64"),
      },
      body: JSON.stringify({
        short_description: "User reported an issue through the chatbot.",
        urgency: "2",
        impact: "2",
        caller_id: "YOUR_CALLER_ID",
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to raise incident" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
