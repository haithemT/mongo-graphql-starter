require("dotenv").config();
import { GraphQLServer, PubSub } from "graphql-yoga";
import mongoose from "mongoose";
import session from "express-session";
import ms from "ms";
import passport from "passport";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import "../config/passport";

import { permissions } from "../graphql/permissions";

import schema from "../graphql/";
import { models } from "./config/db/";

const { MONGO_URI: db, FRONTEND_ENDPOINT } = process.env;

const pubsub = new PubSub();

const options = {
  port: process.env.PORT || "4000",
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground",
  playgroundSettings: {
    "request.credentials": "include" //"omit" | "include" | "same-origin"
  },
  cors: {
    credentials: true,
    origin: [FRONTEND_ENDPOINT] // your frontend url.
  }
};

const context = req => ({
  models,
  pubsub,
  ...req
});

// Connect to MongoDB with Mongoose.
mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(x => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const server = new GraphQLServer({
  schema,
  context,
  middlewares: [permissions]
});
server.express.use(bodyParser.json());
// session middleware
server.express.use(
  session({
    name: "qid",
    secret: `checklist_sectret_session`,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true, //process.env.NODE_ENV === "production",
      maxAge: ms("1d")
    }
  })
);
server.express.use(passport.initialize());
server.express.use(passport.session());
server.express.use(cookieParser());

server.express.get("/logout", function(req, res) {
  req.logout();
  res.clearCookie("jwt");
  res.redirect(FRONTEND_ENDPOINT);
});

server.start(options, ({ port }) => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
