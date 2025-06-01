import request from "supertest";
import { app } from "@app";
import { generateToken } from "@services/authService";
import { beforeAllE2e, afterAllE2e, TEST_USERS } from "@test/e2e/lifecycle";
import { TEST_NETWORKS, TEST_GATEWAYS, TEST_SENSORS, TEST_MEASUREMENTS, TEST_MEASUREMENTS_OUTLIER } from "@test/e2e/setupEntities";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { createGateway } from "@controllers/gatewayController";
import { createSensor } from "@controllers/sensorController";
import { storeMeasurements } from "@controllers/measurementController";

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
    await networkRepo.createNetwork(
      TEST_NETWORKS.network03.code,
      TEST_NETWORKS.network03.name,
      TEST_NETWORKS.network03.description
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
      [TEST_MEASUREMENTS.measurement01, TEST_MEASUREMENTS.measurement02, TEST_MEASUREMENTS.measurement03]
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor02.macAddress,
      [TEST_MEASUREMENTS.measurement04, TEST_MEASUREMENTS.measurement05, TEST_MEASUREMENTS.measurement06]
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

    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
        sensorMacAddress: '11:22:33:44:55:66',
        stats: expect.any(Object),
        measurements: expect.any(Array)
      }),
      expect.objectContaining({
        sensorMacAddress: '66:55:44:33:22:11',
        stats: expect.any(Object),
        measurements: expect.any(Array)
      })
    ]));
    const sensor1 = response.body.find(s => s.sensorMacAddress === '11:22:33:44:55:66');
    const sensor2 = response.body.find(s => s.sensorMacAddress === '66:55:44:33:22:11');

    expect(sensor1.measurements).toHaveLength(3);
    expect(sensor2.measurements).toHaveLength(3);

    expect(response.status).toBe(200);
  });

  it("with dates containing all measurements, should return all measurements", async () => {
    const startDate = "2023-09-01T12:00:00+01:00";
    const endDate = "2023-11-10T12:00:00+01:00";

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ startDate, endDate });

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
        sensorMacAddress: '11:22:33:44:55:66',
        stats: expect.any(Object),
        measurements: expect.any(Array)
      }),
      expect.objectContaining({
        sensorMacAddress: '66:55:44:33:22:11',
        stats: expect.any(Object),
        measurements: expect.any(Array)
      })
    ]));
    const sensor1 = response.body.find(s => s.sensorMacAddress === '11:22:33:44:55:66');
    const sensor2 = response.body.find(s => s.sensorMacAddress === '66:55:44:33:22:11');

    expect(sensor1.measurements).toHaveLength(3);
    expect(sensor2.measurements).toHaveLength(3);
  });

  it("with dates, should return measurements inside the range", async () => {
    const startDate = "2023-10-02T00:00:00+01:00";
    const endDate = "2023-10-03T04:00:00+01:00";

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ startDate, endDate });

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
        sensorMacAddress: '11:22:33:44:55:66',
        stats: expect.any(Object),
        measurements: expect.any(Array)
      }),
      expect.objectContaining({
        sensorMacAddress: '66:55:44:33:22:11',
        stats: expect.any(Object),
        measurements: expect.any(Array)
      })
    ]));

    const sensor1 = response.body.find(s => s.sensorMacAddress === '11:22:33:44:55:66');
    const sensor2 = response.body.find(s => s.sensorMacAddress === '66:55:44:33:22:11');

    expect(sensor1.measurements).toHaveLength(1);
    expect(sensor2.measurements).toHaveLength(2);
  });

  it("just with startDate, should return measurements after the start date", async () => {
    const startDate = "2023-10-02T00:00:00+01:00";

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ startDate });

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body
      .filter(sensor => sensor.measurements)
      .flatMap(sensor => sensor.measurements)).toHaveLength(4);
  });

  it("just with endDate, should return measurements before the end date", async () => {
    const endDate = "2023-10-02T14:00:00+01:00";

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ endDate });

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.status).toBe(200);
    expect(response.body
      .filter(sensor => sensor.measurements)
      .flatMap(sensor => sensor.measurements)).toHaveLength(3);
  });

  it("no sensors in the network, should return empty array", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network03.code}/measurements`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("startDate > endDate, should return no measurements", async () => {
    const endDate = "2023-10-02T00:00:00+01:00";
    const startDate = "2023-10-03T04:00:00+01:00";

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ startDate, endDate });

    console.log(response.body);

    response.body.forEach(element => {
      expect(element).toHaveProperty("sensorMacAddress");
      expect(element).toHaveProperty("stats");
      expect(element).not.toHaveProperty("measurements");
    });
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

  it("with empty sensorMacs, should consider all sensors of network", async () => {
    const sensorMacs: string[] = [];

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ sensorMacs });

    console.log(response.body); // Debugging line to see the response body
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
        sensorMacAddress: '11:22:33:44:55:66',
        stats: expect.any(Object),
        measurements: expect.any(Array)
      }),
      expect.objectContaining({
        sensorMacAddress: '66:55:44:33:22:11',
        stats: expect.any(Object),
        measurements: expect.any(Array)
      })
    ]));
    const sensor1 = response.body.find(s => s.sensorMacAddress === '11:22:33:44:55:66');
    const sensor2 = response.body.find(s => s.sensorMacAddress === '66:55:44:33:22:11');

    expect(sensor1.measurements).toHaveLength(3);
    expect(sensor2.measurements).toHaveLength(3);
  });

  it("with an invalid sensorMac in the list, should ignore it", async () => {
    const sensorMacs = ["00:00:00:00:00:00", TEST_SENSORS.sensor01.macAddress];

    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ sensorMacs });

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
        sensorMacAddress: '11:22:33:44:55:66',
        stats: expect.any(Object),
        measurements: expect.any(Array)
      })
    ]));

    const sensor1 = response.body.find(s => s.sensorMacAddress === '11:22:33:44:55:66');
    expect(sensor1.measurements).toHaveLength(3);
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
    expect(response.body[0]).toHaveProperty("sensorMacAddress");
    expect(response.body[0]).not.toHaveProperty("measurements");
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
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
        sensorMacAddress: '11:22:33:44:55:66',
        stats: expect.any(Object)
      }),
      expect.objectContaining({
        sensorMacAddress: '66:55:44:33:22:11',
        stats: expect.any(Object)
      })
    ]));
    expect(response.body[0]).not.toHaveProperty("measurements");
    expect(response.body[1]).not.toHaveProperty("measurements");
  });

  it("should return only MACs because no measurements exist", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network02.code}/stats`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("sensorMacAddress");
    expect(response.body[0]).toHaveProperty("stats");
    expect(response.body[0]).not.toHaveProperty("measurements");
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
    await networkRepo.createNetwork(
      TEST_NETWORKS.network03.code,
      TEST_NETWORKS.network03.name,
      TEST_NETWORKS.network03.description
    );
    await networkRepo.createNetwork(
      TEST_NETWORKS.network04.code,
      TEST_NETWORKS.network04.name,
      TEST_NETWORKS.network04.description
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
    await createGateway(
      TEST_NETWORKS.network04.code,
      TEST_GATEWAYS.gateway04
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
    await createSensor(
      TEST_NETWORKS.network04.code,
      TEST_GATEWAYS.gateway04.macAddress,
      TEST_SENSORS.sensor04
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor01.macAddress,
      [
        TEST_MEASUREMENTS_OUTLIER.measurement01, 
        TEST_MEASUREMENTS_OUTLIER.measurement02, 
        TEST_MEASUREMENTS_OUTLIER.measurement03, 
        TEST_MEASUREMENTS_OUTLIER.measurement04, 
        TEST_MEASUREMENTS_OUTLIER.measurement05, 
        TEST_MEASUREMENTS_OUTLIER.measurement06
      ]
    );
    await storeMeasurements(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor02.macAddress,
      [TEST_MEASUREMENTS.measurement02, TEST_MEASUREMENTS.measurement04]
    );
    await storeMeasurements(
      TEST_NETWORKS.network02.code,
      TEST_GATEWAYS.gateway03.macAddress,
      TEST_SENSORS.sensor03.macAddress,
      [TEST_MEASUREMENTS.measurement01, TEST_MEASUREMENTS.measurement02]
    );
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("should return outliers for the network", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/outliers`)
      .set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
        sensorMacAddress: '11:22:33:44:55:66',
        stats: expect.any(Object),
        measurements: expect.any(Array)
      }),
      expect.objectContaining({
        sensorMacAddress: '66:55:44:33:22:11',
        stats: expect.any(Object)
      })
    ]));
    expect(response.body
      .filter(sensor => sensor.measurements)
      .flatMap(sensor => sensor.measurements)).toHaveLength(1);
  });

  it("should return only MACs because no measurements exist", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network04.code}/outliers`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("sensorMacAddress");
    expect(response.body[0]).not.toHaveProperty("measurements");
    expect(response.body[0]).not.toHaveProperty("stats");
  });

  it("should return just MACs and stats because no outliers exist", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network02.code}/outliers`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    response.body.forEach(element => {
      expect(element).toHaveProperty("sensorMacAddress");
      expect(element).toHaveProperty("stats");
      expect(element).not.toHaveProperty("measurements");
    }); 
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

    expect(other_res.body.measurements).toHaveLength(6);
    expect(other_res.body.measurements[0].createdAt).toBe("2025-02-18T16:00:00.000Z");
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

  it("no measurements are provided, should insert nothing", async () => {
    const response = await request(app)
      .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .send([]);

    expect(response.status).toBe(201);
  });

  it("should return 400 for invalid date", async () => {
    const newMeasurements = [
      { value: 10, createdAt: "invalid-date" },
      { value: 11, createdAt: "2025-02-18T17:00:00+01:00" }
    ];

    const response = await request(app)
      .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .send(newMeasurements);

    expect(response.status).toBe(400);
  });

  it("should return 400 for missing required field", async () => {
    const newMeasurements = [
      { createdAt: "2025-02-18T17:00:00+01:00" }
    ];

    const response = await request(app)
      .post(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .send(newMeasurements);

    expect(response.status).toBe(400);
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
    expect(response.body).toEqual(
      expect.objectContaining({
        sensorMacAddress: '11:22:33:44:55:66',
        stats: expect.any(Object),
        measurements: expect.any(Array)
      })
    );
    expect(response.body.measurements).toHaveLength(3);
  });

  it("sensor with no measurement, should return just MAC", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network02.code}/gateways/${TEST_GATEWAYS.gateway03.macAddress}/sensors/${TEST_SENSORS.sensor03.macAddress}/measurements`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("sensorMacAddress", TEST_SENSORS.sensor03.macAddress);
    expect(response.body).not.toHaveProperty("measurements");
    expect(response.body).toHaveProperty("stats");
  });

  it("should return 401 for invalid token", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}/measurements`);

    expect(response.status).toBe(401);
  });

  it("should return 400 for invalid date format", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}/measurements`)
      .set("Authorization", `Bearer ${token}`)
      .query({ startDate: "invalid-date", endDate: "2023-11-10T12:00:00+01:00" });

    expect(response.status).toBe(400);
  });

  it("should return 404 for invalid chain of network/gateway/sensor", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor03.macAddress}/measurements`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
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
    expect(response.body).not.toHaveProperty("sensorMacAddress");
    expect(response.body).toHaveProperty("mean");
    expect(response.body).toHaveProperty("variance");
    expect(response.body).toHaveProperty("upperThreshold");
    expect(response.body).toHaveProperty("lowerThreshold");
    expect(response.body).not.toHaveProperty("measurements");
  });

  it("sensor with no measurements, should return 0-ed stats", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network02.code}/gateways/${TEST_GATEWAYS.gateway03.macAddress}/sensors/${TEST_SENSORS.sensor03.macAddress}/stats`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("mean", 0);
    expect(response.body).toHaveProperty("variance", 0);
    expect(response.body).toHaveProperty("upperThreshold", 0);
    expect(response.body).toHaveProperty("lowerThreshold", 0);
    expect(response.body).not.toHaveProperty("measurements");
    expect(response.body).not.toHaveProperty("sensorMacAddress");
  });

  it("should return 401 for invalid token", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}/stats`);

    expect(response.status).toBe(401);
  });
});

describe("GET /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac/outliers", () => {
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
    await createSensor(
      TEST_NETWORKS.network01.code,
      TEST_GATEWAYS.gateway01.macAddress,
      TEST_SENSORS.sensor03
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

  it("should return outliers for the specified sensor", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor02.macAddress}/outliers`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body.sensorMacAddress).toBe(TEST_SENSORS.sensor02.macAddress);
    expect(response.body.measurements).toHaveLength(1);
  });

  // l'array, essendo vuoto, viene eliminato dal RemoveNullAttributes
  it("sensor with no outliers, should return a measurements object without measurements array", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}/outliers`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body.sensorMacAddress).toBe(TEST_SENSORS.sensor01.macAddress);
    expect(response.body).not.toHaveProperty("measurements");
    expect(response.body).toHaveProperty("stats");
  });

  it("sensor with no measurements, should return just the MAC", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor03.macAddress}/outliers`)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body); // Debugging line to see the response body

    expect(response.status).toBe(200);
    expect(response.body.sensorMacAddress).toBe(TEST_SENSORS.sensor03.macAddress);
    expect(response.body).not.toHaveProperty("measurements");
    expect(response.body).not.toHaveProperty("stats");
  });

  it("should return 401 for invalid token", async () => {
    const response = await request(app)
      .get(`/api/v1/networks/${TEST_NETWORKS.network01.code}/gateways/${TEST_GATEWAYS.gateway01.macAddress}/sensors/${TEST_SENSORS.sensor01.macAddress}/outliers`);

    expect(response.status).toBe(401);
  });
});