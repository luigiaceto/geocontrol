import request from "supertest";
import { app } from "@app";
import * as authService from "@services/authService";
import * as userController from "@controllers/userController";
import { UserType } from "@models/UserType";
import { User as UserDTO } from "@dto/User";
import { UnauthorizedError } from "@models/errors/UnauthorizedError";
import { InsufficientRightsError } from "@models/errors/InsufficientRightsError";

jest.mock("@services/authService");
jest.mock("@controllers/userController");

describe("UserRoutes integration", () => {
  const token = "Bearer faketoken";
  const user = "user";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("get all users", async () => {
    const mockUsers: UserDTO[] = [
      { username: "admin", type: UserType.Admin },
      { username: "viewer", type: UserType.Viewer }
    ];

    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (userController.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    const response = await request(app)
      .get("/api/v1/users")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
    expect(authService.processToken).toHaveBeenCalledWith(token, [
      UserType.Admin
    ]);
    expect(userController.getAllUsers).toHaveBeenCalled();
  });

  it("get all users: 401 UnauthorizedError", async () => {
    (authService.processToken as jest.Mock).mockImplementation(() => {
      throw new UnauthorizedError("Unauthorized: No token provided");
    });

    const response = await request(app)
      .get("/api/v1/users")
      .set("Authorization", "Bearer invalid");

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/Unauthorized/);
  });

  it("get all users: 403 InsufficientRightsError", async () => {
    (authService.processToken as jest.Mock).mockImplementation(() => {
      throw new InsufficientRightsError("Forbidden: Insufficient rights");
    });

    const response = await request(app)
      .get("/api/v1/users")
      .set("Authorization", token);

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/Insufficient rights/);
  });

  it("create user", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (userController.createUser as jest.Mock).mockResolvedValue(undefined);

    const newUser = { username: "newuser", password: "pass123", type: UserType.Operator };

    const response = await request(app)
      .post("/api/v1/users")
      .set("Authorization", token)
      .send(newUser);

    expect(response.status).toBe(201);
    expect(userController.createUser).toHaveBeenCalled();
  });

  it("create user: 400 BadRequest from invalid data", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);

    const invalidUser = { username: 123, password: "pass123", type: "NotAUserType" };

    const response = await request(app)
      .post("/api/v1/users")
      .set("Authorization", token)
      .send(invalidUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(userController.createUser).not.toHaveBeenCalled();
  });

  it("create user - error branch", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (userController.createUser as jest.Mock).mockImplementation(() => {
      throw new Error("Create user failed");
    });

    const newUser = { username: "newuser", password: "pass123", type: UserType.Operator };

    const response = await request(app)
      .post("/api/v1/users")
      .set("Authorization", token)
      .send(newUser);

    expect(response.status).toBe(500);
    expect(response.body.message).toMatch(/Create user failed/);
  });

  it("get user by username", async () => {
    const mockUser: UserDTO = { username: "admin", type: UserType.Admin };

    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (userController.getUser as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .get(`/api/v1/users/${user}`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(userController.getUser).toHaveBeenCalledWith(user);
  });

  it("get user by username - error branch", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (userController.getUser as jest.Mock).mockImplementation(() => {
      throw new Error("Get user failed");
    });

    const response = await request(app)
      .get(`/api/v1/users/${user}`)
      .set("Authorization", token);

    expect(response.status).toBe(500);
    expect(response.body.message).toMatch(/Get user failed/);
  });

  it("delete user", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (userController.deleteUser as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .delete(`/api/v1/users/${user}`)
      .set("Authorization", token);

    expect(response.status).toBe(204);
    expect(userController.deleteUser).toHaveBeenCalledWith(user);
  });

  it("delete user - error branch", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (userController.deleteUser as jest.Mock).mockImplementation(() => {
      throw new Error("Delete user failed");
    });

    const response = await request(app)
      .delete(`/api/v1/users/${user}`)
      .set("Authorization", token);

    expect(response.status).toBe(500);
    expect(response.body.message).toMatch(/Delete user failed/);
  });

  it("get all users - error branch (internal error)", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (userController.getAllUsers as jest.Mock).mockImplementation(() => {
      throw new Error("Internal server error from getAllUsers");
    });

    const response = await request(app)
      .get("/api/v1/users")
      .set("Authorization", token);

    expect(response.status).toBe(500);
    expect(response.body.message).toMatch(/Internal server error/);
  });


});
