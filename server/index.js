require("dotenv").config();
import { GraphQLServer, PubSub } from "graphql-yoga";
import mongoose from "mongoose";
import session from "express-session";
import ms from "ms";
import passport from "passport";
import bodyParser from "body-parser";
import "../config/passport";

import schema from "../graphql/";
import { models } from "./config/db/";

const { mongoURI: db } = process.env;

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
    origin: ["http://localhost:4000"] // your frontend url.
  }
};

const context = req => ({
  models,
  pubsub,
  req: req.request
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
  context
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

// server.express.post("/authorize", (req, res, next) => {

// });

// server.express.post("/graphql", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       return res
//         .status(500)
//         .send("Authentication failure due to an internal server error");
//     } else if (!user) {
//       return res.status(401).send("not authorized");
//     } else {
//       user.token = user.generateJWT();

//       return res.json({ user: user.toAuthJSON() });
//     }
//   })(req, res, next);
// });

server.start(options, ({ port }) => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
