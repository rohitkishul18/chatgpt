const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.OPENAI_API_KEY;

        // Log the API key for debugging purposes (remove this after debugging)
        console.log("API Key:", apiKey);

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }],
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error occurred while processing the request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;