import * as supertest from "supertest";
import * as express from "express";

import { userModel } from "../users/model";
import { sendMail } from "../mailer";
import { E2eSetup } from "../test/E2eSetup";
import { verificationTokenModel } from "./model";

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

describe("email confirmation flow", () => {
  let e2eSetup: E2eSetup;
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    e2eSetup = await new E2eSetup().init();
    request = e2eSetup.request;
  });

  afterEach(async () => {
    await e2eSetup.finish();
  });

  it("should send an email to user containing confirmation link", async () => {
    // given, when
    await registerUser();
    const token = await getUserVerificationToken();

    // then
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "artur@kozubek.dev",
        text: expect.stringContaining(`/confirm-email/${token?.value}`),
      })
    );
  });

  it("should mark user verified if token is right", async () => {
    // given
    await registerUser();
    const token = await getUserVerificationToken();

    // when
    const response = await confirmUser(token!.value);

    // then
    expect(response.status).toBe(200);
    const user = await userModel.findOne({ email: "artur@kozubek.dev" });
    expect(user?.verified).toBe(true);
  });

  it("should not mark user verified if token is wrong", async () => {
    // given
    await registerUser();

    // when
    const response = await confirmUser("wrong-token");

    // then
    expect(response.status).toBe(400);
    const user = await userModel.findOne({ email: "artur@kozubek.dev" });
    expect(user?.verified).toBe(false);
  });

  async function confirmUser(tokenValue: string) {
    return request.post("/auth/confirm-email").send({
      token: tokenValue,
    });
  }

  async function getUserVerificationToken() {
    const user = await userModel.findOne({ email: "artur@kozubek.dev" });
    return await verificationTokenModel.findOne({ userId: user?.id });
  }

  async function registerUser() {
    return request.post("/auth/register").send({
      email: "artur@kozubek.dev",
      password: "password",
    });
  }
});
