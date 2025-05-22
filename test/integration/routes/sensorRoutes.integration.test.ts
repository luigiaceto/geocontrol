import request from "supertest";
import { app } from "@app";
import * as authService from "@services/authService";
import * as sensorController from "@controllers/sensorController";
import { UserType } from "@models/UserType";
import { Sensor as SensorDTO } from "@dto/Sensor";
import { UnauthorizedError } from "@models/errors/UnauthorizedError";

jest.mock("@services/authService");
jest.mock("@controllers/sensorController");

describe("SensorRoutes integration", () => {
  const token = "Bearer faketoken";
  const networkCode = "net1";
  const gatewayMac = "gw1";
  const sensorMac = "sensor1";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("get all sensors by gateway", async () => {
    const mockSensors: SensorDTO[] = [
      { macAddress: "sensor1", name: "S1", description: "", variable: "temp", unit: "C" },
      { macAddress: "sensor2", name: "S2", description: "", variable: "hum", unit: "%" }
    ];
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (sensorController.getSensorsByGateway as jest.Mock).mockResolvedValue(mockSensors);

    const response = await request(app)
      .get(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}/sensors`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSensors);
    expect(authService.processToken).toHaveBeenCalledWith(token, [
      UserType.Admin, UserType.Operator, UserType.Viewer
    ]);
    expect(sensorController.getSensorsByGateway).toHaveBeenCalledWith(networkCode, gatewayMac);
  });

  it("get a specific sensor", async () => {
    const mockSensor: SensorDTO = { macAddress: sensorMac, name: "S1", description: "", variable: "temp", unit: "C" };
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (sensorController.getSensorByMac as jest.Mock).mockResolvedValue(mockSensor);

    const response = await request(app)
      .get(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}/sensors/${sensorMac}`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSensor);
    expect(sensorController.getSensorByMac).toHaveBeenCalledWith(networkCode, gatewayMac, sensorMac);
  });

  it("create a sensor", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (sensorController.createSensor as jest.Mock).mockResolvedValue(undefined);

    const sensorData = { macAddress: "sensor3", name: "S3", description: "", variable: "temp", unit: "C" };
    const response = await request(app)
      .post(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}/sensors`)
      .set("Authorization", token)
      .send(sensorData);

    expect(response.status).toBe(201);
    expect(sensorController.createSensor).toHaveBeenCalled();
  });

  it("update a sensor", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (sensorController.updateSensor as jest.Mock).mockResolvedValue(undefined);

    const sensorData = { macAddress: sensorMac, name: "S1 Updated", description: "", variable: "temp", unit: "C" };
    const response = await request(app)
      .patch(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}/sensors/${sensorMac}`)
      .set("Authorization", token)
      .send(sensorData);

    expect(response.status).toBe(204);
    expect(sensorController.updateSensor).toHaveBeenCalled();
  });

  it("delete a sensor", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (sensorController.deleteSensor as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .delete(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}/sensors/${sensorMac}`)
      .set("Authorization", token);

    expect(response.status).toBe(204);
    expect(sensorController.deleteSensor).toHaveBeenCalledWith(networkCode, gatewayMac, sensorMac);
  });

  it("get all sensors: 401 UnauthorizedError from auth middlewere", async () => {
    (authService.processToken as jest.Mock).mockImplementation(() => {
      throw new UnauthorizedError("Unauthorized: No token provided");
    });

    const response = await request(app)
      .get(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}/sensors`)
      .set("Authorization", "Bearer invalid");

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/Unauthorized/);
  });

  it("create a sensor: 400 BadRequest from validator middlewere", async () => {
    (authService.processToken as jest.Mock).mockResolvedValue(undefined);
    (sensorController.createSensor as jest.Mock).mockResolvedValue(undefined);

    const invalidSensorData = { macAddress: 12345, name: "S3", description: "", variable: "temp", unit: "C" };
    const response = await request(app)
        .post(`/api/v1/networks/${networkCode}/gateways/${gatewayMac}/sensors`)
        .set("Authorization", token)
        .send(invalidSensorData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(/macAddress/);
    expect(sensorController.createSensor).not.toHaveBeenCalled();
  });
});