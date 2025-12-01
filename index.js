import express from "express";
import fetch from "node-fetch";
import xml2js from "xml2js";

const app = express();
const PORT = process.env.PORT || 3000;

// Kanal-ID von sawlties
const CHANNEL_ID = "UCpzQaCoOD-W68Gc3guIMQ0Q";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

app.get("/", async (req, res) => {
  try {
    const response = await fetch(FEED_URL);
    const xml = await response.text();
    const parsed = await xml2js.parseStringPromise(xml);

    const entries = parsed.feed.entry;
    const latest = entries[0];

    const linkObj = latest.link.find((l) => l.$.rel === "alternate");
    const videoUrl = linkObj.$.href;

    res.type("text/plain").send(videoUrl);
  } catch (e) {
    res.status(500).send("Error fetching data");
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
