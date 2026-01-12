import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** 1) Force canonical host (www -> non-www) BEFORE anything else */
app.use((req, res, next) => {
  const host = req.headers.host || "";
  if (host.startsWith("www.")) {
    return res.redirect(301, `https://${host.replace("www.", "")}${req.url}`);
  }
  next();
});

/** 2) Always serve robots.txt explicitly (no ambiguity) */
app.get("/robots.txt", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.status(200).send(
`User-agent: *
Disallow:

Sitemap: https://bametalmoldingandconstruction.com/sitemap.xml
`
  );
});

/** 3) Serve sitemap.xml explicitly */
app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  res.sendFile(path.join(__dirname, "sitemap.xml"));
});

/** 4) Serve static assets + index.html from repo root */
app.use(express.static(__dirname));

/** 5) SPA fallback (routes like /services, /portfolio, /about) */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
