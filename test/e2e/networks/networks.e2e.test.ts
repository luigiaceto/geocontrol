import request from "supertest";
import { app } from "@app";
import { generateToken } from "@services/authService";
import { beforeAllE2e, afterAllE2e, TEST_USERS } from "@test/e2e/lifecycle";
import { TEST_NETWORKS } from "@test/e2e/setupEntities";
import { NetworkRepository } from "@repositories/NetworkRepository";

describe("NETWORKS E2E", () => {
  let token: string;

  beforeAll(async () => {
    await beforeAllE2e();
    token = generateToken(TEST_USERS.admin);

    const networkRepo = new NetworkRepository();
    await networkRepo.createNetwork(
      TEST_NETWORKS.network01.code,
      TEST_NETWORKS.network01.name,
      TEST_NETWORKS.network01.description
    );
    await networkRepo.createNetwork(
      TEST_NETWORKS.network02.code,
      TEST_NETWORKS.network02.name,
      TEST_NETWORKS.network02.description
    );
    
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  describe("GET /networks", () => {
    it("should return all networks", async () => {
      const res = await request(app)
        .get("/api/v1/networks")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: TEST_NETWORKS.network01.code,
            name: TEST_NETWORKS.network01.name,
            description: TEST_NETWORKS.network01.description,
          }),
          expect.objectContaining({
            code: TEST_NETWORKS.network02.code,
            name: TEST_NETWORKS.network02.name,
            description: TEST_NETWORKS.network02.description,
          }),
        ])
      );
    });

    it("should return 401 for unauthorized access", async () => {
      const res = await request(app)
        .get("/api/v1/networks")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(401);
    });
  });

  describe("GET /networks/:networkCode", () => {
    it("should return a specific network", async () => {
      const res = await request(app)
        .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("code", TEST_NETWORKS.network01.code);
      expect(res.body).toHaveProperty("name", TEST_NETWORKS.network01.name);
      expect(res.body).toHaveProperty("description", TEST_NETWORKS.network01.description);
    });

    it("should return 404 for non-existent network", async () => {
      const res = await request(app)
        .get("/api/v1/networks/non-existing-network")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("should return 401 for unauthorized access", async () => {
      const res = await request(app)
        .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}`)
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(401);
    });
  });

  describe("POST /networks", () => {
    it("should create a new network", async () => {
      const newNetwork = {
        code: "net03",
        name: "Network 03",
        description: "Third network"
      };

      const res = await request(app)
        .post("/api/v1/networks")
        .set("Authorization", `Bearer ${token}`)
        .send(newNetwork);

      expect(res.status).toBe(201);

      const getRes = await request(app)
        .get(`/api/v1/networks/${newNetwork.code}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body).toHaveProperty("code", newNetwork.code);
    });

    it("should return 400 for invalid network data", async () => {
      const invalidNetwork = {
        code: 123,
        name: "Invalid Network",
        description: "invalid network description"
      };

      const res = await request(app)
        .post("/api/v1/networks")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidNetwork);

      expect(res.status).toBe(400);
    });

    it("should return 400 for missing required fields", async () => {
      const newNetwork = {
        name: "Network 04",
        description: "Fourth network"
      };

      const res = await request(app)
        .post("/api/v1/networks")
        .set("Authorization", `Bearer ${token}`)
        .send(newNetwork);

      expect(res.status).toBe(400);
    });

    it("should return 401 for unauthorized access", async () => {
      const newNetwork = {
        code: "net04",
        name: "Network 04",
        description: "Fourth network"
      };

      const res = await request(app)
        .post("/api/v1/networks")
        .set("Authorization", "Bearer invalid-token")
        .send(newNetwork);

      expect(res.status).toBe(401);
    });

    it("should return 403 for insufficient permissions", async () => {
      const newNetwork = {
        code: "net05",
        name: "Network 05",
        description: "Fifth network"
      };

      const userToken = generateToken(TEST_USERS.viewer);

      const res = await request(app)
        .post("/api/v1/networks")
        .set("Authorization", `Bearer ${userToken}`)
        .send(newNetwork);

      expect(res.status).toBe(403);
    });

    it("should return 409 for network code already in use", async () => {
      const existingNetwork = {
        code: TEST_NETWORKS.network01.code,
        name: "Duplicate Network",
        description: "Duplicate"
      };

      const res = await request(app)
        .post("/api/v1/networks")
        .set("Authorization", `Bearer ${token}`)
        .send(existingNetwork);

      expect(res.status).toBe(409);
    });
  });

  describe("PATCH /networks/:networkCode", () => {
    it("no networkCode update, should update a network", async () => {
      const updatedNetwork = {
        name: "Updated Network Name",
        description: "Updated description"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedNetwork);

      expect(res.status).toBe(204);

      const getRes = await request(app)
        .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.name).toBe(updatedNetwork.name);
      expect(getRes.body.description).toBe(updatedNetwork.description);
    });

    it("should do nothing because the body is empty", async () => {
      const res = await request(app)
        .patch(`/api/v1/networks/${TEST_NETWORKS.network02.code}`)
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(204);

      const getRes = await request(app)
        .get(`/api/v1/networks/${TEST_NETWORKS.network02.code}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.name).toBe(TEST_NETWORKS.network02.name);
      expect(getRes.body.description).toBe(TEST_NETWORKS.network02.description);
    });

    it("networkCode update, should update a network", async () => {
      const updatedNetwork = {
        code: "updated-net01",
        description: "Updated description"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedNetwork);

      expect(res.status).toBe(204);

      const getRes = await request(app)
        .get(`/api/v1/networks/${updatedNetwork.code}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.code).toBe(updatedNetwork.code);
      expect(getRes.body.description).toBe(updatedNetwork.description);
    });

    it("should return 400 for invalid network data", async () => {
      const invalidNetwork = {
        name: 123,
        description: "invalid"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}`)
        .set("Authorization", `Bearer ${token}`)
        .send(invalidNetwork);

      expect(res.status).toBe(400);
    });

    it("should return 404 for non-existent network", async () => {
      const updatedNetwork = {
        name: "Updated",
        description: "Updated"
      };

      const res = await request(app)
        .patch("/api/v1/networks/non-existing-network")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedNetwork);

      expect(res.status).toBe(404);
    });

    it("should return 401 for unauthorized access", async () => {
      const updatedNetwork = {
        name: "Unauthorized Update",
        description: "Unauthorized"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}`)
        .set("Authorization", "Bearer invalid-token")
        .send(updatedNetwork);

      expect(res.status).toBe(401);
    });

    it("should return 403 for insufficient permissions", async () => {
      const updatedNetwork = {
        name: "Viewer Update",
        description: "Viewer"
      };

      const userToken = generateToken(TEST_USERS.viewer);

      const res = await request(app)
        .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updatedNetwork);

      expect(res.status).toBe(403);
    });

    it("should return 409 for conflicting updates", async () => {
      const conflictingNetwork = {
        code: TEST_NETWORKS.network02.code,
        name: "Conflicting Update",
        description: "Conflicting"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}`)
        .set("Authorization", `Bearer ${token}`)
        .send(conflictingNetwork);

      expect(res.status).toBe(409);
    });
  });

  describe("DELETE /networks/:networkCode", () => {
    it("should delete a network", async () => {
      const res = await request(app)
        .delete(`/api/v1/networks/${TEST_NETWORKS.network02.code}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);

      const getRes = await request(app)
        .get(`/api/v1/networks/${TEST_NETWORKS.network02.code}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getRes.status).toBe(404);
    });

    it("should return 404 for non-existent network", async () => {
      const res = await request(app)
        .delete("/api/v1/networks/non-existing-network")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("should return 401 for unauthorized access", async () => {
      const res = await request(app)
        .delete(`/api/v1/networks/${TEST_NETWORKS.network01.code}`)
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(401);
    });

    it("should return 403 for insufficient permissions", async () => {
      const userToken = generateToken(TEST_USERS.viewer);

      const res = await request(app)
        .delete(`/api/v1/networks/${TEST_NETWORKS.network01.code}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });
});