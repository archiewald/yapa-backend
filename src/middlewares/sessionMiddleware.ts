import * as session from "express-session";
import * as connectMongo from "connect-mongo";

const MongoStore = connectMongo(session);

export function sessionMiddleware(mongoUrl: string) {
  return session({
    store: new MongoStore({
      url: mongoUrl,
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "none",
    },
  });
}
