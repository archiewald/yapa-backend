import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import * as supertest from "supertest";

import { Server } from "../app";
import { userModel } from "../users/model";
import { sendMail } from "../mailer";
import { E2eSetup } from "../test/E2eSetup";

jest.mock("../mailer.ts");

describe("/auth/register", () => {
  let e2eSetup: E2eSetup;
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    e2eSetup = await new E2eSetup().init();
    request = e2eSetup.request;
  });

  afterEach(async () => {
    await e2eSetup.finish();
  });

  it("should respond with a new user", async () => {
    // given, when
    const response = await registerUser();

    // then
    expect(response.status).toBe(200);

    const user = response.body;
    expect(typeof user.id).toBe("string");
    expect(user.email).toBe("artur@kozubek.dev");
    expect(user.verified).toBe(false);
  });

  it("should save a user in db", async () => {
    // given, when
    await registerUser();

    // then
    const user = await userModel.findOne({ email: "artur@kozubek.dev" });
    expect(user?.email).toBe("artur@kozubek.dev");
    expect(typeof user?.password).toBe("string");
    expect(typeof user?.password).not.toBe("password"); // hashed password ;)
  });

  it("should send an invitation email", async () => {
    // given, when
    await registerUser();

    // then
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "artur@kozubek.dev" })
    );
  });

  it("should not allow passwords shorter than 6 chars", async () => {
    // given, when
    const response = await registerUser({ password: "pass" });

    // then
    expect(response.status).toBe(400);
  });

  it("should not allow to invite the same user twice", async () => {
    // given, when
    const successResponse = await registerUser();
    const failedResponse = await registerUser();

    // then
    expect(successResponse.status).toBe(200);
    expect(failedResponse.status).toBe(400);
  });

  async function registerUser(params?: { email?: string; password?: string }) {
    return request.post("/auth/register").send({
      email: "artur@kozubek.dev",
      password: "password",
      ...params,
    });
  }
});
