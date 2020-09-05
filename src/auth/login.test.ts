import supertest from "supertest";
import * as express from "express";

import { E2eSetup } from "../test/E2eSetup";
import { userModel } from "../users/model";

jest.mock("../mailer.ts");
jest.mock("../middlewares/loggerMiddleware.ts", () => ({
  loggerMiddleware: (
    _request: express.Request,
    _response: express.Response,
    next: express.NextFunction
  ) => {
    next();
  },
}));

describe("/auth/login", () => {
  let e2eSetup: E2eSetup;
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    e2eSetup = await new E2eSetup().init();
    request = e2eSetup.request;
  });

  afterEach(async () => {
    await e2eSetup.finish();
  });

  it("should not login if user is not registered", async () => {
    // given, when
    const response = await loginUser();

    // then
    expect(response.status).toBe(400);
  });

  it("should not login if user is not verified", async () => {
    // given
    await registerUser(); // registered but not verified

    // when
    const response = await loginUser();

    // then
    expect(response.status).toBe(400);
  });

  it("should login if user is registered and verified", async () => {
    // given
    await registerUser();
    await verifyUser();

    // when
    const response = await loginUser();

    // then
    expect(response.status).toBe(200);
  });

  it("should not login if user is registered and verified but password is wrong", async () => {
    // given
    await registerUser();
    await verifyUser();

    // when
    const response = await loginUser({ password: "wrong_password" });

    // then
    expect(response.status).toBe(400);
  });

  it("should not load user if not logged in", async () => {
    // given
    await registerUser();
    await verifyUser();
    // ... but not logged in

    // when
    const response = await getUser();

    // then
    expect(response.body).toEqual({});
  });

  it("should load user if logged in", async () => {
    // given
    await registerUser();
    await verifyUser();
    await loginUser();

    // when
    const response = await getUser();

    // then
    expect(response.body).toMatchObject({ email: "artur@kozubek.dev" });
  });

  async function loginUser(params?: { email?: string; password?: string }) {
    return request.post("/auth/login").send({
      email: "artur@kozubek.dev",
      password: "password",
      ...params,
    });
  }

  async function registerUser() {
    return request.post("/auth/register").send({
      email: "artur@kozubek.dev",
      password: "password",
    });
  }

  async function verifyUser() {
    await userModel.findOneAndUpdate(
      { email: "artur@kozubek.dev" },
      { verified: true }
    );
  }

  async function getUser() {
    return request.get("/user");
  }
});
