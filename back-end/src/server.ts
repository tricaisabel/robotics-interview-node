import { ApolloServer } from "@apollo/server";
import { loadFiles } from "@graphql-tools/load-files";
import { resolvers } from "./resolvers/resolvers";
import { connectToDatabase } from "./config/db";

async function initializeServer() {
  const typeDefs = await loadFiles("public/schema.graphql");

  await connectToDatabase();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  return server;
}

export default initializeServer;