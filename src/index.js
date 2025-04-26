import server from "./server.js";
import { expressMiddleware } from "@apollo/server/express4";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';

import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import { getImageById } from "./controllers/labelController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
app.use(express.static("public"));

app.get("/image/:id", getImageById);

app.get("/sessions", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "sessions.html"));
});

const port = process.env.PORT || 3000;

await server.start();

app.use(
  "/graphql",
  cors(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      const sessionId = req.headers["session-id"];
      return { sessionId };
    },
  })
);

httpServer.listen(port, () => {
  console.log(`Server ready at http://localhost:${port}`);
});
