import { ApolloServer } from "@apollo/server";
import { connectToDatabase } from "./config/db.js";
import { loadFiles } from "@graphql-tools/load-files";
import { resolvers } from "./resolvers/resolvers.js";

const typeDefs = await loadFiles("public/schema.graphql");

await connectToDatabase();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default server;
