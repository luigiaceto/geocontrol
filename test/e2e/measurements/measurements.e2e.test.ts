import request from "supertest";
import { app } from "@app";
import { generateToken } from "@services/authService";
import { beforeAllE2e, afterAllE2e, TEST_USERS } from "@test/e2e/lifecycle";
import { TEST_NETWORKS, TEST_GATEWAYS, TEST_SENSORS, TEST_MEASUREMENTS, TEST_MEASUREMENTS_OUTLIER } from "@test/e2e/setupEntities";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { createGateway } from "@controllers/gatewayController";
import { createSensor } from "@controllers/sensorController";
import { storeMeasurements } from "@controllers/measurementController";
import { createNetwork } from "@controllers/networkController";

describe("GET /networks/:networkCode/measurements", () => {
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
    await createGateway(
      TEST_NETWORKS.network02.code,
      TEST_GATEWAYS.gateway03
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
    await createSensor(
      TEST_NETWORKS.network02.code,
      TEST_GATEWAYS.gateway03.macAddress,
      TEST_SENSORS.sensor03
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor01.macAddress,
      [TEST_MEASUREMENTS.measurement01, TEST_MEASUREMENTS.measurement03, TEST_MEASUREMENTS.measurement05]
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor02.macAddress,
      [TEST_MEASUREMENTS.measurement02, TEST_MEASUREMENTS.measurement04]
    );
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("no dates, should return all measurements", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body
    console.log(response.body[0]);

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("sensorMacAddress", TEST_SENSORS.sensor01.macAddress);
  });

  it("with dates, should return all measurements", async () => {
    const startDate = "2023-09-01T12:00:00+01:00";
    const endDate = "2023-11-10T12:00:00+01:00";

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ startDate, endDate });

    console.log(response.body); // Debugging line to see the response body
    console.log(response.body[0]);

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("sensorMacAddress", TEST_SENSORS.sensor01.macAddress);
  });

  it("with dates, should return measurements inside the range", async () => {
    const startDate = "2023-10-02T12:00:00+01:00";
    const endDate = "2023-10-04T12:00:00+01:00";

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ startDate, endDate });

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("sensorMacAddress", TEST_SENSORS.sensor01.macAddress);
  });

  it("with startDate, should return measurements after the start date", async () => {
    const startDate = "2023-10-02T00:00:00+01:00";

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ startDate });

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("sensorMacAddress", TEST_SENSORS.sensor01.macAddress);
  });

  it("with endDate, should return measurements before the end date", async () => {
    const endDate = "2023-10-02T14:00:00+01:00";

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ endDate });

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("sensorMacAddress", TEST_SENSORS.sensor01.macAddress);
  });

  it("should return 400 for invalid date", async () => {
    const invalidDate = "invalid-date";

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ startDate: invalidDate });
    
    expect(response.status).toBe(400);
  });

  it("with sensorMacs, should return measurements for the specified sensors", async () => {
    const sensorMacs = [TEST_SENSORS.sensor01.macAddress];

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ sensorMacs });

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("sensorMacAddress", TEST_SENSORS.sensor01.macAddress);
  });

  // ASPETTA RISPOSTA A ISSUE
  it.skip("with empty sensorMacs, should return empty array", async () => {
    const sensorMacs: string[] = [];

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ sensorMacs });

    console.log(response.body); // Debugging line to see the response body
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("with an invalid sensorMac in the list, should ignore it", async () => {
    const sensorMacs = ["00:00:00:00:00:00", TEST_SENSORS.sensor01.macAddress];

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ sensorMacs });

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
  });

  it("with only invalid sensorMacs, should return empty array", async () => {
    const sensorMacs = ["00:00:00:00:00:00", "AA:22:33:44:55:BB"];

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ sensorMacs });

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("network sensors have no measurements, should return only MACs", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network02.code}/measurements`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("sensorMacAddress", TEST_SENSORS.sensor03.macAddress);
    expect(response.body).not.toHaveProperty("measurements");
  });

  it("should return 401 for unauthorized access", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`);

    expect(response.status).toBe(401);
  });

  it("should return 404 for non-existent network", async () => {
    const nonExistentNetworkCode = "nonExistentNetwork";

    const response = await request(app)
      .get(`/api/v1/networks/${nonExistentNetworkCode}/measurements`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});

describe("GET /networks/:networkCode/stats", () => {
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
    await createGateway(
      TEST_NETWORKS.network02.code,
      TEST_GATEWAYS.gateway03
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
    await createSensor(
      TEST_NETWORKS.network02.code,
      TEST_GATEWAYS.gateway03.macAddress,
      TEST_SENSORS.sensor03
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor01.macAddress,
      [TEST_MEASUREMENTS.measurement01, TEST_MEASUREMENTS.measurement03, TEST_MEASUREMENTS.measurement05]
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor02.macAddress,
      [TEST_MEASUREMENTS.measurement02, TEST_MEASUREMENTS.measurement04]
    );
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("should return stats for the network", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/stats`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty("measurements");
  });

  it("should return only MACs because no measurements exist", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network02.code}/stats`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("sensorMacAddress", TEST_SENSORS.sensor03.macAddress);
    expect(response.body).not.toHaveProperty("measurements");
  });

  it("should return 401 for unauthorized access", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/stats`);

    expect(response.status).toBe(401);
  });

  it("should return 404 for non-existent network", async () => {
    const nonExistentNetworkCode = "nonExistentNetwork";

    const response = await request(app)
      .get(`/api/v1/networks/${nonExistentNetworkCode}/stats`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});

describe("GET /networks/:networkCode/outliers", () => {
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
    await createGateway(
      TEST_NETWORKS.network02.code,
      TEST_GATEWAYS.gateway03
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
    await createSensor(
      TEST_NETWORKS.network02.code,
      TEST_GATEWAYS.gateway03.macAddress,
      TEST_SENSORS.sensor03
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor01.macAddress,
      [TEST_MEASUREMENTS.measurement01, TEST_MEASUREMENTS.measurement03, TEST_MEASUREMENTS.measurement05]
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor02.macAddress,
      [TEST_MEASUREMENTS.measurement02, TEST_MEASUREMENTS.measurement04]
    );
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("should return no measurements field because no outliers exist", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/outliers`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
  });

  it("should return only MACs because no measurements exist", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network02.code}/outliers`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("sensorMacAddress", TEST_SENSORS.sensor03.macAddress);
    expect(response.body).not.toHaveProperty("measurements");
  });

  it("should return 401 for unauthorized access", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/outliers`);

    expect(response.status).toBe(401);
  });

  it("should return 404 for non-existent network", async () => {
    const nonExistentNetworkCode = "nonExistentNetwork";

    const response = await request(app)
      .get(`/api/v1/networks/${nonExistentNetworkCode}/outliers`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});

describe("POST /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac/measurements", () => {
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
    await createGateway(
      TEST_NETWORKS.network02.code,
      TEST_GATEWAYS.gateway03
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
    await createSensor(
      TEST_NETWORKS.network02.code,
      TEST_GATEWAYS.gateway03.macAddress,
      TEST_SENSORS.sensor03
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor01.macAddress,
      [TEST_MEASUREMENTS.measurement01, TEST_MEASUREMENTS.measurement03, TEST_MEASUREMENTS.measurement05]
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor02.macAddress,
      [TEST_MEASUREMENTS.measurement02, TEST_MEASUREMENTS.measurement04]
    );

    await networkRepo.createNetwork(
      TEST_NETWORKS.network03.code,
      TEST_NETWORKS.network03.name,
      TEST_NETWORKS.network03.description
    );
    await createGateway(
      TEST_NETWORKS.network03.code,
      TEST_GATEWAYS.gateway04
    );
    await createSensor(
      TEST_NETWORKS.network03.code,
      TEST_GATEWAYS.gateway04.macAddress,
      TEST_SENSORS.sensor04
    );
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("should create measurements", async () => {
    const newMeasurements = [
      { value: 10, createdAt: "2025-02-18T17:00:00+01:00" },
      { value: 11, createdAt: "2025-02-18T17:00:00+01:00" },
      { value: 12, createdAt: "2025-02-18T17:00:00+01:00" },
      { value: 12, createdAt: "2025-02-18T17:00:00+01:00" },
      { value: 13, createdAt: "2025-02-18T17:00:00+01:00" },
      { value: 30, createdAt: "2025-02-18T17:00:00+01:00" }
    ];

    const res = await request(app)
      .post(`/api/v1/networks/${TEST_NETWORKS.network03.code}/gateways/${TEST_GATEWAYS.gateway04.macAddress}/sensors/${TEST_SENSORS.sensor04.macAddress}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .send(newMeasurements);

    expect(res.status).toBe(201);

    let other_res = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network03.code}/gateways/${TEST_GATEWAYS.gateway04.macAddress}/sensors/${TEST_SENSORS.sensor04.macAddress}/measurements`)
      .set("Authorization", `Bearer ${token}`);

    console.log(other_res.body); // Debugging line to see the response body
  });

  it("should return 403 for unsufficient rights", async () => {
    const newMeasurements = [
      { value: 10, createdAt: "2025-02-18T17:00:00+01:00" },
      { value: 11, createdAt: "2025-02-18T17:00:00+01:00" },
      { value: 12, createdAt: "2025-02-18T17:00:00+01:00" },
      { value: 12, createdAt: "2025-02-18T17:00:00+01:00" },
      { value: 13, createdAt: "2025-02-18T17:00:00+01:00" },
      { value: 30, createdAt: "2025-02-18T17:00:00+01:00" }
    ];

    const response = await request(app)
      .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}/measurements`)
      .set("Authorization", `Bearer ${generateToken(TEST_USERS.viewer)}`)
      .send(newMeasurements);

    expect(response.status).toBe(403);
  });
});

describe("GET /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac/measurements", () => {
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
    await createGateway(
      TEST_NETWORKS.network02.code,
      TEST_GATEWAYS.gateway03
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
    await createSensor(
      TEST_NETWORKS.network02.code,
      TEST_GATEWAYS.gateway03.macAddress,
      TEST_SENSORS.sensor03
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor01.macAddress,
      [TEST_MEASUREMENTS.measurement01, TEST_MEASUREMENTS.measurement03, TEST_MEASUREMENTS.measurement05]
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor02.macAddress,
      [TEST_MEASUREMENTS.measurement02, TEST_MEASUREMENTS.measurement04]
    );

    await networkRepo.createNetwork(
      TEST_NETWORKS.network03.code,
      TEST_NETWORKS.network03.name,
      TEST_NETWORKS.network03.description
    );
    await createGateway(
      TEST_NETWORKS.network03.code,
      TEST_GATEWAYS.gateway04
    );
    await createSensor(
      TEST_NETWORKS.network03.code,
      TEST_GATEWAYS.gateway04.macAddress,
      TEST_SENSORS.sensor04
    );
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("should return measurements for the specified sensor", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}/measurements`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body.measurements).toHaveLength(3);
  });

  it("should return just MAC of sensor with no measurement", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network02.code}/gateways/${TEST_GATEWAYS.gateway03.macAddress}/sensors/${TEST_SENSORS.sensor03.macAddress}/measurements`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("sensorMacAddress", TEST_SENSORS.sensor03.macAddress);
  });
});

describe("GET /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac/stats", () => {
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
    await createGateway(
      TEST_NETWORKS.network02.code,
      TEST_GATEWAYS.gateway03
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
    await createSensor(
      TEST_NETWORKS.network02.code,
      TEST_GATEWAYS.gateway03.macAddress,
      TEST_SENSORS.sensor03
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor01.macAddress,
      [TEST_MEASUREMENTS.measurement01, TEST_MEASUREMENTS.measurement03, TEST_MEASUREMENTS.measurement05]
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor02.macAddress,
      [TEST_MEASUREMENTS.measurement02, TEST_MEASUREMENTS.measurement04]
    );

    await networkRepo.createNetwork(
      TEST_NETWORKS.network03.code,
      TEST_NETWORKS.network03.name,
      TEST_NETWORKS.network03.description
    );
    await createGateway(
      TEST_NETWORKS.network03.code,
      TEST_GATEWAYS.gateway04
    );
    await createSensor(
      TEST_NETWORKS.network03.code,
      TEST_GATEWAYS.gateway04.macAddress,
      TEST_SENSORS.sensor04
    );
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("should return stats for the specified sensor", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}/stats`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
  });

  it("should return 0-ed stats for sensor with no measurements", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network02.code}/gateways/${TEST_GATEWAYS.gateway03.macAddress}/sensors/${TEST_SENSORS.sensor03.macAddress}/stats`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("mean", 0);
    expect(response.body).toHaveProperty("variance", 0);
    expect(response.body).toHaveProperty("upperThreshold", 0);
    expect(response.body).toHaveProperty("lowerThreshold", 0);
  });
});

describe.only("GET /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac/outliers", () => {
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
    await createGateway(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01
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
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor01.macAddress,
      [TEST_MEASUREMENTS.measurement01, TEST_MEASUREMENTS.measurement02, TEST_MEASUREMENTS.measurement03]
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor02.macAddress,
      [
        TEST_MEASUREMENTS_OUTLIER.measurement01, TEST_MEASUREMENTS_OUTLIER.measurement02, 
        TEST_MEASUREMENTS_OUTLIER.measurement03, TEST_MEASUREMENTS_OUTLIER.measurement04,
        TEST_MEASUREMENTS_OUTLIER.measurement05, TEST_MEASUREMENTS_OUTLIER.measurement06
      ]  
    );
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it.skip("should return outliers for the specified sensor", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor02.macAddress}/outliers`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
  });

  it("should return empty measurements array for sensor with no outliers", async () => {
    let res = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}/measurements`)
      .set("Authorization", `Bearer ${token}`);
    console.log(res.body); // Debugging line to see the response body

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}/outliers`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
  });
});