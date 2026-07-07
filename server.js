const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/convert", async (req, res) => {
  const from = req.query.from;

  if (!from) {
    return res.status(400).json({
      error: "Please provide a source currency."
    });
  }

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/${from}`
    );

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch exchange rates."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});