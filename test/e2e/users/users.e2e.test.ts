import request from "supertest";
import { app } from "@app";
import { generateToken } from "@services/authService";
import { beforeAllE2e, afterAllE2e, TEST_USERS } from "@test/e2e/lifecycle";

describe("GET /users (e2e)", () => {
  let token: string;

  beforeAll(async () => {
    await beforeAllE2e();
    token = generateToken(TEST_USERS.admin);
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("get all users", async () => {
    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);

    const usernames = res.body.map((u: any) => u.username).sort();
    const types = res.body.map((u: any) => u.type).sort();

    expect(usernames).toEqual(["admin", "operator", "viewer"]);
    expect(types).toEqual(["admin", "operator", "viewer"]);
  });

  it("should return 401 for unauthorized access", async () => {
    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", "Bearer invalid-token");
    expect(res.status).toBe(401);
  });

  it("should return 403 for non-admin user", async () => {
    const nonAdminToken = generateToken(TEST_USERS.viewer);
    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${nonAdminToken}`);

    expect(res.status).toBe(403);
  });

  
  
});

describe("GET /users/:username (e2e)", () => {
  let token: string;

  beforeAll(async () => {
    await beforeAllE2e();
    token = generateToken(TEST_USERS.admin);
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("get user by username", async () => {
    const res = await request(app)
      .get(`/api/v1/users/${TEST_USERS.operator.username}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe("operator");
    expect(res.body.type).toBe("operator");
  });

  it("should return 401 for unauthorized access", async () => {
    const res = await request(app)
      .get(`/api/v1/users/${TEST_USERS.operator.username}`)
      .set("Authorization", "Bearer invalid-token");
    expect(res.status).toBe(401);
  });

  it("should return 403 for non-admin user", async () => {
    const nonAdminToken = generateToken(TEST_USERS.viewer);
    const res = await request(app)
      .get(`/api/v1/users/${TEST_USERS.operator.username}`)
      .set("Authorization", `Bearer ${nonAdminToken}`);

    expect(res.status).toBe(403);
  });

  it("should return 404 for non-existent user", async () => {
    const res = await request(app)
      .get(`/api/v1/users/non-existing-user`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe("POST /users (e2e)", () => {
  let token: string;

  beforeAll(async () => {
    await beforeAllE2e();
    token = generateToken(TEST_USERS.admin);
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  
  it("create user", async () => {
    const newUser = {
      username: "newuser",
      password: "newpassword",
      type: "viewer"
    };

    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${token}`)
      .send(newUser);

    expect(res.status).toBe(201);
  });

  it("should return 401 for unauthorized request", async () => {
    const newUser = {
      username: "unauthorizeduser",
      password: "password",
      type: "viewer"
    };
    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", "Bearer invalid-token")
      .send(newUser); 

    expect(res.status).toBe(401);
  });

  it("should return 403 for non-admin user", async () => {
    const nonAdminToken = generateToken(TEST_USERS.viewer);
    const newUser = {
      username: "nonadminuser",
      password: "password",
      type: "viewer"
    };

    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${nonAdminToken}`)
      .send(newUser);

    expect(res.status).toBe(403);
  });

  it("should return 409 for username already exists", async () => {
    const existingUser = {
      username: TEST_USERS.operator.username, // This user already exists
      password: "password",
      type: "viewer"
    };

    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${token}`)
      .send(existingUser);

    expect(res.status).toBe(409);
  });

  it("should return 400 for missing password and type", async () => {
    const invalidUser = {
      username: "invaliduser",
    };

    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${token}`)
      .send(invalidUser);

    expect(res.status).toBe(400);
  });

  it("should return 400 for invalid user type", async () => {
    const invalidUser = {
      username: "invalidtypeuser",
      password: "password",
      type: "invalidtype" // Invalid user type
    };

    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${token}`)
      .send(invalidUser);

    expect(res.status).toBe(400);
  });
});

describe("DELETE /users/:username (e2e)", () => {
  let token: string;

  beforeAll(async () => {
  await beforeAllE2e();
  token = generateToken(TEST_USERS.admin);
  });

  afterAll(async () => {
  await afterAllE2e();
  });

  it("delete user", async () => {
  const res = await request(app)
    .delete(`/api/v1/users/${TEST_USERS.operator.username}`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(204);
  });

  it("should return 404 for non-existent user", async () => {
  const res = await request(app)
    .delete(`/api/v1/users/non-existing-user`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(404);
  });

  it("should return 403 for non-admin user", async () => {
  const nonAdminToken = generateToken(TEST_USERS.viewer);
  const res = await request(app)
    .delete(`/api/v1/users/${TEST_USERS.operator.username}`)
    .set("Authorization", `Bearer ${nonAdminToken}`);

  expect(res.status).toBe(403);
  });

  it("should return 401 for unauthorized request", async () => {
  const res = await request(app)
    .delete(`/api/v1/users/${TEST_USERS.operator.username}`)
    .set("Authorization", "Bearer invalid-token");

  expect(res.status).toBe(401);
  });
});

