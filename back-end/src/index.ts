import server from "./server";
import { expressMiddleware } from "@apollo/server/express4";

import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import { getImageById } from "./controllers/labelController";
import initializeServer from "./server";

const app = express();
const httpServer = http.createServer(app);
app.use(express.static("public"));

app.get("/image/:id", getImageById);

const port = process.env.PORT || 3000;

const startServer = async () => {
  const server = await initializeServer();
  await server.start();

  app.use(
    "/graphql",
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const sessionId = req.headers["session-id"];
        return { sessionId: sessionId as string };
      },
    })
  );
};

startServer();

httpServer.listen(port, () => {
  console.log(`Server ready at http://localhost:${port}`);
});
