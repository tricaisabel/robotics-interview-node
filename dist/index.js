var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = yield initializeServer();
    app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server, {
        context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, res }) {
            const sessionId = req.headers["session-id"];
            return { sessionId };
        }),
    }));
    server.start();
});
startServer();
httpServer.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}`);
});
