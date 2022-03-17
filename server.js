require("dotenv").config();
import http from "http";
import express from "express"
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser, protectResolver } from "./users/users.utils";

const PORT = process.env.PORT;
const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: async (ctx) => {
        if (ctx.req) {
            return {
                loggedInUser: await getUser(ctx.req.headers.token),
                protectResolver,
            }
        } else {
            const { connection: { context } } = ctx;
            return {
                loggedInUser: context.loggedInUser
            }
        }
    },
    subscriptions: {
        onConnect: async ({ token }) => {
            if (!token) {
                throw new Error("접근이 불가능합니다.");
            }
            const loggedInUser = await getUser(token);
            return {
                loggedInUser,
            }
        }
    }
});

const app = express();
app.use(logger("dev"));
// upload 폴더를 인터넷에 올리는 것
app.use("/static", express.static("uploads"));
apollo.applyMiddleware({ app });

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}/`);
});
