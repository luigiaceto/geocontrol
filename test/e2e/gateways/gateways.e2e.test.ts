import request from "supertest";
import { app } from "@app";
import { generateToken } from "@services/authService";
import { beforeAllE2e, afterAllE2e, TEST_USERS } from "@test/e2e/lifecycle";
import { TEST_NETWORKS, TEST_GATEWAYS, TEST_SENSORS } from "@test/e2e/setupEntities";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { createGateway } from "@controllers/gatewayController";
import { createSensor } from "@controllers/sensorController";

describe("GET /networks/:networkCode/gateways (e2e)", () => {
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
        await createGateway(
            TEST_NETWORKS.network01.code,
            TEST_GATEWAYS.gateway01
        );
        await createGateway(
            TEST_NETWORKS.network01.code,
            TEST_GATEWAYS.gateway02
        );

        await createSensor(
            TEST_NETWORKS.network01.code,
            TEST_GATEWAYS.gateway01.macAddress,
            TEST_SENSORS.sensor01
        );

    });

    afterAll(async () => {
        await afterAllE2e();
    });


    it("should return all gateways for a network", async () => {
        const res = await request(app)
            .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body[0].macAddress).toBe(TEST_GATEWAYS.gateway01.macAddress);
        expect(res.body[1].macAddress).toBe(TEST_GATEWAYS.gateway02.macAddress);
       
        expect(res.body[1].sensors ?? []).toEqual([]);

        expect(res.body[0].sensors.length).toBe(1);
        expect(res.body[0].sensors[0].macAddress).toBe(TEST_SENSORS.sensor01.macAddress);
    });



    it("should return 200 with an empty array when the network has no gateways", async () => {
        const res = await request(app)
            .get(`/api/v1/networks/${TEST_NETWORKS.network02.code}/gateways`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toEqual([]);
    });

    it("should return 401 for unauthorized access", async () => {
        const res = await request(app)
            .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways`)
            .set("Authorization", "Bearer invalid-token");

        expect(res.status).toBe(401);
    });

    it("should return 404 for non-existent network", async () => {
        const res = await request(app) 
            .get(`/api/v1/networks/non-existing-network/gateways`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
    });
});

describe("GET /networks/:networkCode/gateways/:gatewayMac (e2e)", () => {
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
        await createGateway(
            TEST_NETWORKS.network01.code,
            TEST_GATEWAYS.gateway01
        );
        await createGateway(
            TEST_NETWORKS.network01.code,
            TEST_GATEWAYS.gateway02
        );

        await createSensor(
            TEST_NETWORKS.network01.code,
            TEST_GATEWAYS.gateway01.macAddress,
            TEST_SENSORS.sensor01
        );

    });

    afterAll(async () => {
        await afterAllE2e();
    });

    it("should return a specific gateway", async () => {
        const res = await request(app)
            .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.macAddress).toBe(TEST_GATEWAYS.gateway01.macAddress);
        expect(res.body.sensors.length).toBe(1);
        expect(res.body.sensors[0].macAddress).toBe(TEST_SENSORS.sensor01.macAddress);

    });

    it("should return 404 for non-existent gateway", async () => {
        const res = await request(app)
            .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/non-existing-gateway`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
    });

    it("should return 401 for unauthorized access", async () => {
        const res = await request(app)
            .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", "Bearer invalid-token");

        expect(res.status).toBe(401);
    });

    it("should return 404 for non-existent network", async () => {
        const res = await request(app)
            .get(`/api/v1/networks/non-existing-network/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
    });


});

describe("POST /networks/:networkCode/gateways (e2e)", () => {
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
        await createGateway(
            TEST_NETWORKS.network01.code,
            TEST_GATEWAYS.gateway01
        );
        await createGateway(
            TEST_NETWORKS.network01.code,
            TEST_GATEWAYS.gateway02
        );

    }
    );  
    afterAll(async () => {
        await afterAllE2e();
    });

    it("should create a new gateway", async () => {
        const newGateway = {
            macAddress: "A:B:C:D:E:F",
            name: "New Gateway",
            description:"This is a new gateway"
        };

        let res = await request(app)
            .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways`)
            .set("Authorization", `Bearer ${token}`)
            .send(newGateway);
        
        expect(res.status).toBe(201);

        res = await request(app)
            .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${newGateway.macAddress}`) 
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("macAddress", newGateway.macAddress);
    });

    it("should return 400 for invalid gateway data", async () => {
        const invalidGateway = {
            macAddress: 123,
            name: "Invalid Gateway",
            description: "invalid gateway description"
        };

        const res = await request(app)
            .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways`)
            .set("Authorization", `Bearer ${token}`)
            .send(invalidGateway);

        expect(res.status).toBe(400);
    });

    it("should return 400 for missing required fields", async () => {
        const newGateway = {
            name: "Gateway without MAC",
            description: "This gateway has no MAC address"
        };

        const res = await request(app)
            .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways`)
            .set("Authorization", `Bearer ${token}`)
            .send(newGateway);

        expect(res.status).toBe(400);
    });

    it("should return 401 for unauthorized access", async () => {
        const newGateway = {
            macAddress: "A:B:C:D:E:F",
            name: "Gateway",
            description: "new gateway"
        };

        const res = await request(app)
            .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways`)
            .set("Authorization", "Bearer invalid-token")
            .send(newGateway);

        expect(res.status).toBe(401);
    });

    it("should return 403 for being just a viewer", async () => {
        const viewerToken = generateToken(TEST_USERS.viewer);
        const newGateway = {
            macAddress: "A:B:C:D:E:F",
            name: "new Gateway",
            description: "new gateway description"
        };

        const res = await request(app)
            .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways`)
            .set("Authorization", `Bearer ${viewerToken}`)
            .send(newGateway);

        expect(res.status).toBe(403);
    });

    it("should return 404 for non-existent network", async () => {
        const newGateway = {
            macAddress: "A:B:C:D:E:F",
            name: "New Gateway",
            description: "This is a new gateway"
        };

        const res = await request(app)
            .post(`/api/v1/networks/non-existing-network/gateways`)
            .set("Authorization", `Bearer ${token}`)
            .send(newGateway);

        expect(res.status).toBe(404);
    });

    it("should return 409 for gateway already in use", async () => {
        const existingGateway = {
            macAddress: TEST_GATEWAYS.gateway01.macAddress,
            name: "Existing Gateway",
            description: "Existing gateway description"
        };

        const res = await request(app)
            .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways`)
            .set("Authorization", `Bearer ${token}`)
            .send(existingGateway);

        expect(res.status).toBe(409);
    });

});

describe("PATCH /networks/:networkCode/gateways/:gatewayMac (e2e)", () => {
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
        await createGateway(
            TEST_NETWORKS.network01.code,
            TEST_GATEWAYS.gateway01
        );
        await createGateway(
            TEST_NETWORKS.network01.code,
            TEST_GATEWAYS.gateway02
        );
    });

    afterAll(async () => {
        await afterAllE2e();
    });

    it("should update a gateway", async () => {
        const updatedGateway = {
            macAddress: "AA:BB:CC:DD:EE:FF",
            name: "Updated Gateway",
            description: "This is an updated gateway"
        };

        let res = await request(app)
            .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedGateway);

        expect(res.status).toBe(204);

        res = await request(app)
            .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${updatedGateway.macAddress}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("macAddress", updatedGateway.macAddress);
        expect(res.body).toHaveProperty("name", updatedGateway.name);
        expect(res.body).toHaveProperty("description", updatedGateway.description);
    });

    it("should update a gateway without changing macAddress", async () => {
        const partialUpdate = {
            name: "Partial Update Name",
            description: "Partial Update Description"
        };

        const res = await request(app)
            .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", `Bearer ${token}`)
            .send(partialUpdate);

        expect(res.status).toBe(204);

        const getRes = await request(app)
            .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", `Bearer ${token}`);

        expect(getRes.status).toBe(200);
        expect(getRes.body.name).toBe(partialUpdate.name);
        expect(getRes.body.description).toBe(partialUpdate.description);
    });


    it("should return 400 for invalid gateway data", async () => {
        const invalidGateway = {
            macAddress: 123,
            name: "Invalid Gateway",
            description: "invalid gateway description"
        };

        const res = await request(app)
            .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", `Bearer ${token}`)
            .send(invalidGateway);

        expect(res.status).toBe(400);
    });

    it("should return 401 for unauthorized access", async () => {
        const updatedGateway = {
            macAddress: "AA:BB:CC:DD:EE:FF",
            name: "Updated Gateway",
            description: "This is an updated gateway"
        };

        const res = await request(app)
            .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", "Bearer invalid-token")
            .send(updatedGateway);

        expect(res.status).toBe(401);
    });

    it("should return 403 for being just a viewer", async () => {
        const viewerToken = generateToken(TEST_USERS.viewer);
        const updatedGateway = {
            macAddress: "AA:BB:CC:DD:EE:FF",
            name: "Updated Gateway",
            description: "This is an updated gateway"
        };

        const res = await request(app)
            .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", `Bearer ${viewerToken}`)
            .send(updatedGateway);

        expect(res.status).toBe(403);
    });

    it("should return 404 for non-existent gateway", async () => {
        const updatedGateway = {
            macAddress: "AA:BB:CC:DD:EE:FF",
            name: "Updated Gateway",
            description: "This is an updated gateway"
        };

        const res = await request(app)
            .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/non-existing-gateway`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedGateway);

        expect(res.status).toBe(404);
    });

    it("should return 404 for non-existent network", async () => {
        const updatedGateway = {
            macAddress: "AA:BB:CC:DD:EE:FF",
            name: "Updated Gateway",
            description: "This is an updated gateway"
        };

        const res = await request(app)
            .patch(`/api/v1/networks/non-existing-network/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedGateway);

        expect(res.status).toBe(404);
    });

    it("should return 409 for gateway already in use", async () => {
        const existingGateway = {
            macAddress: TEST_GATEWAYS.gateway02.macAddress,
            name: "Existing Gateway",
            description: "Existing gateway description"
        };

        const res = await request(app)
            .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", `Bearer ${token}`)
            .send(existingGateway);

        expect(res.status).toBe(409);
    });
});

describe("DELETE /networks/:networkCode/gateways/:gatewayMac (e2e)", () => {
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
        await createGateway(
            TEST_NETWORKS.network01.code,
            TEST_GATEWAYS.gateway01
        );
        await createGateway(
            TEST_NETWORKS.network01.code,
            TEST_GATEWAYS.gateway02
        );
    });

    afterAll(async () => {
        await afterAllE2e();
    });

    it("should delete a gateway", async () => {
        const res = await request(app)
            .delete(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(204);

        const getRes = await request(app)
            .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", `Bearer ${token}`);

        expect(getRes.status).toBe(404);
    });

    it("should return 404 for non-existent gateway", async () => {
        const res = await request(app)
            .delete(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/non-existing-gateway`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
    });

    it("should return 401 for unauthorized access", async () => {
        const res = await request(app)
            .delete(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", "Bearer invalid-token");

        expect(res.status).toBe(401);
    });

    it("should return 403 for being just a viewer", async () => {
        const viewerToken = generateToken(TEST_USERS.viewer);

        const res = await request(app)
            .delete(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", `Bearer ${viewerToken}`);

        expect(res.status).toBe(403);
    });

    it("should return 404 for non-existent network", async () => {
        const res = await request(app)
            .delete(`/api/v1/networks/non-existing-network/gateways/${TEST_GATEWAYS.gateway01.macAddress}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
    });

});