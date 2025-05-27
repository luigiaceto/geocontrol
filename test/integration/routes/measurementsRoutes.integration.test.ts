import request from "supertest";
import { app } from "@app";
import * as authService from "@services/authService";
import * as measurementController from "@controllers/measurementController";
import { UserType } from "@models/UserType";
import { UnauthorizedError } from "@models/errors/UnauthorizedError";
import { MeasurementRepository } from "@repositories/MeasurementRepository";
import { verifyChainToSensor } from "@services/verifyService";

jest.mock("@services/authService");
jest.mock("@controllers/measurementController");
jest.mock("@repositories/MeasurementRepository");
jest.mock("@services/verifyService", () => ({
  verifyChainToSensor: jest.fn(),
}));


describe("MeasurementRoutes integration", () => {
  const token = "Bearer faketoken";
  const networkCode = "net1";
  const gatewayMac = "gw1";
  const sensorMac = "s1";

  afterEach(() => {
    jest.clearAllMocks();
  });

    it("store measurements with body as array", async () => {
    // Mock token processing
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);

    // Mock verifyChainToSensor and return a mock repo with getSensorByMac
    const mockSensorRepo = {
      getSensorByMac: jest.fn().mockResolvedValue({ id: 123 }),
    };
    (verifyChainToSensor as jest.Mock).mockResolvedValue(mockSensorRepo);

    // Mock controller's storeMeasurements to simulate successful storage
    const mockStoreMeasurements = jest.fn().mockResolvedValue(undefined);
    (measurementController.storeMeasurements as jest.Mock).mockImplementation(mockStoreMeasurements);

    // Send an array of measurements
    const data = [
      { createdAt: new Date().toISOString(), value: 42.1 },
      { createdAt: new Date().toISOString(), value: 43.2 },
    ];

    const res = await request(app)
      .post("/api/v1/networks/NET-1/gateways/GW-1/sensors/SEN-1/measurements")
      .set("Authorization", "Bearer FAKE_TOKEN")
      .send(data);

    expect(res.status).toBe(201);
    expect(mockStoreMeasurements).toHaveBeenCalledTimes(1);
    expect(mockStoreMeasurements).toHaveBeenCalledWith(
    "NET-1", "GW-1", "SEN-1", expect.any(Array));
  });

  it("get measurements of sensor", async () => {
    const mockData = [{ timestamp: "2024-01-01T00:00:00Z", value: 30 }];
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (measurementController.getMeasurementsOfSensor as jest.Mock).mockResolvedValue(mockData);

    const res = await request(app)
      .get(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}/sensors/${sensorMac}/measurements`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it("get sensor stats", async () => {
    const mockStats = { min: 10, max: 50, avg: 30 };
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (measurementController.getStatsOfSensor as jest.Mock).mockResolvedValue(mockStats);

    const res = await request(app)
      .get(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}/sensors/${sensorMac}/stats`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockStats);
  });

  it("get sensor outliers", async () => {
    const mockOutliers = [{ timestamp: "2024-01-01T00:00:00Z", value: 100 }];
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (measurementController.getOutliersMeasurementsOfSensor as jest.Mock).mockResolvedValue(mockOutliers);

    const res = await request(app)
      .get(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}/sensors/${sensorMac}/outliers`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockOutliers);
  });

  it("get network measurements", async () => {
    const mockData = [{ timestamp: "2024-01-01T00:00:00Z", value: 22 }];
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (measurementController.getMeasurementsOfNetwork as jest.Mock).mockResolvedValue(mockData);

    const res = await request(app)
      .get(`/api/v1/networks/${networkCode}/measurements?sensorMacs=s1&sensorMacs=s2`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it("get network stats", async () => {
    const mockStats = [
    {
        sensorMac: "SEN-1",
        stats: {
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-01-01T01:00:00Z",
        mean: 25,
        variance: 5,
        upperThreshold: 30,
        lowerThreshold: 20
        },
        measurements: null
    }
    ];
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (measurementController.getStatsOfNetwork as jest.Mock).mockResolvedValue(mockStats);

    const res = await request(app)
      .get(`/api/v1/networks/${networkCode}/stats?sensorMacs=s1&sensorMacs=s2`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockStats);
  });

  it("get network outliers", async () => {
    const mockOutliers = [{ timestamp: "2024-01-01T00:00:00Z", value: 100 }];
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (measurementController.getOutliersMeasurementsOfNetwork as jest.Mock).mockResolvedValue(mockOutliers);

    const res = await request(app)
      .get(`/api/v1/networks/${networkCode}/outliers?sensorMacs=s1`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockOutliers);
  });

  it("unauthorized error from auth", async () => {
    (authService.processToken as jest.Mock).mockImplementation(() => {
      throw new UnauthorizedError("Unauthorized");
    });

    const res = await request(app)
      .get(`/api/v1/networks/${networkCode}/stats`)
      .set("Authorization", "Bearer invalid");

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Unauthorized/);
  });

   it("store measurements - error branch", async () => {

    const data = [{ createdAt: new Date().toISOString(), value: 45.6 }];

    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (measurementController.storeMeasurements as jest.Mock).mockImplementation(() => {
        throw new Error("Test error");
    });

    const res = await request(app)
        .post(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}/sensors/${sensorMac}/measurements`)
        .set("Authorization", token)
        .send(data);

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/Test error/);
    });


  it("get measurements - error branch", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (measurementController.getMeasurementsOfSensor as jest.Mock).mockImplementation(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}/sensors/${sensorMac}/measurements`)
      .set("Authorization", token);

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/Test error/);
  });

  it("get statistics - error branch", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (measurementController.getStatsOfSensor as jest.Mock).mockImplementation(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}/sensors/${sensorMac}/stats`)
      .set("Authorization", token);

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/Test error/);
  });

  it("get outliers - error branch", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (measurementController.getOutliersMeasurementsOfSensor as jest.Mock).mockImplementation(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}/sensors/${sensorMac}/outliers`)
      .set("Authorization", token);

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/Test error/);
  });
});
