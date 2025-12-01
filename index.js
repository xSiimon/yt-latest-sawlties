import express from "express";
import fetch from "node-fetch";
import xml2js from "xml2js";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Richtige Kanal-ID von "sawlties"
const USERNAME = "sawlties";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${USERNAME}`;

app.get("/", async (req, res) => {
  try {
    const response = await fetch(FEED_URL);
    if (!response.ok) {
      return res.status(500).send("Error fetching feed");
    }

    const xml = await response.text();
    const parsed = await xml2js.parseStringPromise(xml);

    const entries = parsed.feed.entry;
    if (!entries || entries.length === 0) {
      return res.status(404).send("No videos found");
    }

    const latest = entries[0];

    const linkObj = latest.link.find((l) => l.$.rel === "alternate");
    const videoUrl = linkObj?.$?.href;

    if (!videoUrl) {
      return res.status(500).send("Could not extract video URL");
    }

    res.type("text/plain").send(videoUrl);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching data");
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

