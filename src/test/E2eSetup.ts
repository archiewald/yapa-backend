import * as express from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as supertest from "supertest";
// TODO: add d.ts
const supertestSession = require("supertest-session");
import * as mongoose from "mongoose";
import { Server } from "../app";

export class E2eSetup {
  mongoServer: MongoMemoryServer;
  request!: supertest.SuperTest<supertest.Test>;
  app!: express.Application;

  constructor() {
    this.mongoServer = new MongoMemoryServer();
  }

  async init() {
    const mongoUrl = await this.mongoServer.getUri();
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    this.app = new Server(mongoUrl).app;
    this.request = supertestSession(this.app);
    return this;
  }

  async finish() {
    await mongoose.disconnect();
    await this.mongoServer.stop();
  }
}
