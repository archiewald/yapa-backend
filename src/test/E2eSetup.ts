import { MongoMemoryServer } from "mongodb-memory-server";
import * as supertest from "supertest";
import * as mongoose from "mongoose";
import { Server } from "../app";

export class E2eSetup {
  mongoServer: MongoMemoryServer;
  request!: supertest.SuperTest<supertest.Test>;

  constructor() {
    this.mongoServer = new MongoMemoryServer();
  }

  async init() {
    const mongoUrl = await this.mongoServer.getUri();
    await mongoose.connect(mongoUrl);
    this.request = supertest(new Server(mongoUrl).app);
    return this;
  }

  async finish() {
    await mongoose.disconnect();
    await this.mongoServer.stop();
  }
}
