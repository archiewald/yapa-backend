import "dotenv/config";
import * as mongoose from "mongoose";

import { Server } from "./app";

const mongoUrl = process.env.MONGO_URL!;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = new Server(mongoUrl);

server.listen(process.env.PORT!);
