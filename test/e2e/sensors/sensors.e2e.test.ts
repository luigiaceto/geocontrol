import request from "supertest";
import { app } from "@app";
import { generateToken } from "@services/authService";
import { beforeAllE2e, afterAllE2e, TEST_USERS } from "@test/e2e/lifecycle";
import { TEST_NETWORKS, TEST_GATEWAYS, TEST_SENSORS } from "@test/e2e/setupEntities";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { createGateway } from "@controllers/gatewayController";
import { createSensor } from "@controllers/sensorController";

describe("GET /networks/:networkCode/gateways/:gatewayMac/sensors (e2e)", () => {
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
    await createSensor(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor02
    );
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("should return all sensors for a gateway", async () => {
    const res = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body).toContainEqual(TEST_SENSORS.sensor01);
    expect(res.body).toContainEqual(TEST_SENSORS.sensor02);
  });

  it("should return 404 for non-existing network", async () => {
    const res = await request(app)
      .get(`/api/v1/networks/non-existing-network/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("should return 401 for unauthorized access", async () => {
    const res = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors`)
      .set("Authorization", `Bearer invalid-token`);

    expect(res.status).toBe(401);
  });

  it("should return 404 for non-existing gateway", async () => {
    const res = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/non-existing-gateway/sensors`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("should return 200 with empty array for gateway with no sensors", async () => {
    const res = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway02.macAddress}/sensors`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 404 for invalid chain of entities", async () => {
    const res = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network02.code}/gateways/${TEST_GATEWAYS.gateway02.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe("GET /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac (e2e)", () => {
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
    await createSensor(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor02
    );
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("should return a specific sensor", async () => {
    const res = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("macAddress", TEST_SENSORS.sensor01.macAddress);
  });

  it("should return 404 for non-existing sensor", async () => {
    const res = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/non-existing-sensor`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe("POST /networks/:networkCode/gateways/:gatewayMac/sensors (e2e)", () => {
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
    await createSensor(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor02
    );
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("should create a new sensor", async () => {
    const newSensor = {
      macAddress: "AA:BB:CC:DD:EE:FF",
      name: "New Sensor",
      description: "New Sensor Description",
      variable: "temp",
      unit: "C"
    };

    let res = await request(app)
      .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors`)
      .set("Authorization", `Bearer ${token}`)
      .send(newSensor);

    expect(res.status).toBe(201);

    res = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${newSensor.macAddress}`)
      .set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("macAddress", newSensor.macAddress);
  });

  it("should return 400 for invalid sensor MAC", async () => {
    const invalidSensor = {
      macAddress: 1234,
      name: "Invalid Sensor",
      description: "Invalid Sensor Description",
      variable: "temp",
      unit: "C"
    };

    const res = await request(app)
      .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors`)
      .set("Authorization", `Bearer ${token}`)
      .send(invalidSensor);

    expect(res.status).toBe(400);
  });

  it("should return 400 for missing property" , () => {
    const newSensor = {
      macAddress: "CA:FE:BA:BE:BE:EF",
      name: "New Sensor",
      description: "New Sensor Description",
      variable: "temp"
      // Missing 'unit'
    };

    // andare ad aggiungere nel controller che gestisce la creazione delle entità un throw 
    // dell'errore 400 in caso i campi necessari alla creazione non siano presenti
    return request(app)
      .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors`)
      .set("Authorization", `Bearer ${token}`)
      .send(newSensor)
      .expect(400);
  });



  it("should return 401 for unauthorized access", async () => {
    const newSensor = {
      macAddress: "AA:BB:CC:DD:EE:FF",
      name: "New Sensor",
      description: "New Sensor Description",
      variable: "temp",
      unit: "C"
    };

    const res = await request(app)
      .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors`)
      .set("Authorization", `Bearer invalid-token`)
      .send(newSensor);

    expect(res.status).toBe(401);
  });

  it("should return 403 for being just a viewer", async () => {
    const viewerToken = generateToken(TEST_USERS.viewer);
    const newSensor = {
      macAddress: "AA:BB:CC:DD:EE:FF",
      name: "New Sensor",
      description: "New Sensor Description",
      variable: "temp",
      unit: "C"
    };

    const res = await request(app)
      .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors`)
      .set("Authorization", `Bearer ${viewerToken}`)
      .send(newSensor);

    expect(res.status).toBe(403);
  });

  it("should return 409 for sensor already in use", async () => {
    const existingSensor = {
      macAddress: TEST_SENSORS.sensor01.macAddress,
      name: "Existing Sensor",
      description: "Existing Sensor Description",
      variable: "temp",
      unit: "C"
    };

    const res = await request(app)
      .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors`)
      .set("Authorization", `Bearer ${token}`)
      .send(existingSensor);

    expect(res.status).toBe(409);
  });
});

describe("PATCH /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac (e2e)", () => {
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
    await createSensor(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor02
    );
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("should update a sensor", async () => {
    const updatedSensor = {
      name: "Updated Sensor",
      description: "Updated Sensor Description",
      variable: "humidity",
      unit: "%"
    };

    let res = await request(app)
      .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedSensor);

    expect(res.status).toBe(204);

    res = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", updatedSensor.name);
    expect(res.body).toHaveProperty("description", updatedSensor.description);
    expect(res.body).toHaveProperty("variable", updatedSensor.variable);
    expect(res.body).toHaveProperty("unit", updatedSensor.unit);
  });

  it("should return 409 for sensor already in use", async () => {
    const existingSensor = {
      macAddress: TEST_SENSORS.sensor02.macAddress,
      name: "Existing Sensor",
      description: "Existing Sensor Description",
      variable: "temp",
      unit: "C"
    };

    const res = await request(app)
      .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}`)
      .set("Authorization", `Bearer ${token}`)
      .send(existingSensor);

    expect(res.status).toBe(409);
  });

  it("should return 400 for invalid sensor data", async () => {
    const invalidSensor = {
      macAddress: 1234,
      name: "Invalid Sensor",
      description: "Invalid Sensor Description",
      variable: "temp",
      unit: "C"
    };

    const res = await request(app)
      .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}`)
      .set("Authorization", `Bearer ${token}`)
      .send(invalidSensor);

    expect(res.status).toBe(400);
  });

  it("should return 401 for unauthorized access", async () => {
    const updatedSensor = {
      name: "Updated Sensor",
      description: "Updated Sensor Description",
      variable: "humidity",
      unit: "%"
    };

    const res = await request(app)
      .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}`)
      .set("Authorization", `Bearer invalid-token`)
      .send(updatedSensor);

    expect(res.status).toBe(401);
  });

  it("should return 403 for being just a viewer", async () => {
    const viewerToken = generateToken(TEST_USERS.viewer);
    const updatedSensor = {
      name: "Updated Sensor",
      description: "Updated Sensor Description",
      variable: "humidity",
      unit: "%"
    };

    const res = await request(app)
      .patch(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}`)
      .set("Authorization", `Bearer ${viewerToken}`)
      .send(updatedSensor);

    expect(res.status).toBe(403);
  });
});

describe("DELETE /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac (e2e)", () => {
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
    await createSensor(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor02
    );
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("should delete a sensor", async () => {
    const res = await request(app)
      .delete(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);

    const getRes = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });

  it("should return 404 for non-existing sensor", async () => {
    const res = await request(app)
      .delete(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/non-existing-sensor`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("should return 401 for unauthorized access", async () => {
    const res = await request(app)
      .delete(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}`)
      .set("Authorization", `Bearer invalid-token`);

    expect(res.status).toBe(401);
  });

  it("should return 403 for being just a viewer", async () => {
    const viewerToken = generateToken(TEST_USERS.viewer);

    const res = await request(app)
      .delete(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}`)
      .set("Authorization", `Bearer ${viewerToken}`);

    expect(res.status).toBe(403);
  });

  it("should return 404 for invalid chain of entities", async () => {
    const res = await request(app)
      .delete(`/api/v1/networks/${TEST_NETWORKS.network02.code}/gateways/${TEST_GATEWAYS.gateway02.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});