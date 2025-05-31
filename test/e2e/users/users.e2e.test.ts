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

  it("unauthorized access, should return 401", async () => {
    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", "Bearer invalid-token");
    expect(res.status).toBe(401);
  });

  it("non-admin user, should return 403", async () => {
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

  it("unauthorized access, should return 401", async () => {
    const res = await request(app)
      .get(`/api/v1/users/${TEST_USERS.operator.username}`)
      .set("Authorization", "Bearer invalid-token");
    expect(res.status).toBe(401);
  });

  it("non-admin user, should return 403", async () => {
    const nonAdminToken = generateToken(TEST_USERS.viewer);
    const res = await request(app)
      .get(`/api/v1/users/${TEST_USERS.operator.username}`)
      .set("Authorization", `Bearer ${nonAdminToken}`);

    expect(res.status).toBe(403);
  });

  it("non-existent user, should return 404", async () => {
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

  it("unauthorized access, should return 401", async () => {
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

  it("non-admin user, should return 403", async () => {
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

  it("username already exists, should return 409", async () => {
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

  it("missing password and type, should return 400", async () => {
    const invalidUser = {
      username: "invaliduser",
    };

    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${token}`)
      .send(invalidUser);

    expect(res.status).toBe(400);
  });

  it("invalid user type, should return 400", async () => {
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

  it("non-existent user, should return 404", async () => {
  const res = await request(app)
    .delete(`/api/v1/users/non-existing-user`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(404);
  });

  it("non-admin user, should return 403", async () => {
  const nonAdminToken = generateToken(TEST_USERS.viewer);
  const res = await request(app)
    .delete(`/api/v1/users/${TEST_USERS.operator.username}`)
    .set("Authorization", `Bearer ${nonAdminToken}`);

  expect(res.status).toBe(403);
  });

  it("unauthorized request, should return 401", async () => {
  const res = await request(app)
    .delete(`/api/v1/users/${TEST_USERS.operator.username}`)
    .set("Authorization", "Bearer invalid-token");

  expect(res.status).toBe(401);
  });
});

