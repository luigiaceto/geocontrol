import request from "supertest";
import { app } from "@app";
import * as authController from "@controllers/authController";
import { User as UserDTO } from "@dto/User";
import { UserType } from "@models/UserType";
import { UnauthorizedError } from "@models/errors/UnauthorizedError";

jest.mock("@controllers/authController");

describe("AuthenticationRoutes integration", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a token for valid credentials", async () => {
    const user: UserDTO = {
      username: "root",
      password: "rootpassword"
    };

    const tokenDTO = { token: "faketoken" };
    (authController.getToken as jest.Mock).mockResolvedValue(tokenDTO);

    const response = await request(app)
      .post("/api/v1/auth")
      .send(user);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(tokenDTO);
    expect(authController.getToken).toHaveBeenCalledWith(user);
  });

  it("should return 401 for invalid credentials", async () => {
    (authController.getToken as jest.Mock).mockRejectedValue(new UnauthorizedError("Invalid credentials"));

    const response = await request(app)
      .post("/api/v1/auth")
      .send({ username: "user1", password: "wrong" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(/Invalid credentials/);
  });

  it("should return 400 for invalid request body", async () => {
    const response = await request(app)
      .post("/api/v1/auth")
      .send({ password: "pass" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(authController.getToken).not.toHaveBeenCalled();
  });
});