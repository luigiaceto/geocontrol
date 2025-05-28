import * as sensorController from "@controllers/sensorController";
import { GatewayDAO } from "@dao/GatewayDAO";
import { SensorRepository } from "@repositories/SensorRepository";
import * as verifyService from "@services/verifyService";

jest.mock("@services/verifyService");
jest.mock("@repositories/NetworkRepository");
jest.mock("@repositories/GatewayRepository");
jest.mock("@repositories/SensorRepository");

it("createSensor - crea un nuovo sensore se non esiste conflitto", async () => {
  const networkCode = "net01";
  const gatewayMac = "1:2:3:4:5:6";

  const sensorDto = {
    macAddress: "11:22:33:44:55:66",
    name: "s01",
    description: "desc",
    variable: "temperature",
    unit: "°C"
  };

  const fakeGateway = new GatewayDAO();
  fakeGateway.id = 1;
  fakeGateway.macAddress = gatewayMac;

  const mockGatewayRepo = {
    getGatewayByMac: jest.fn().mockResolvedValue(fakeGateway)
  };

  const mockSensorRepo = {
    getSensorByMac: jest.fn().mockResolvedValue(null), // simulate no conflict
    createSensor: jest.fn().mockResolvedValue(undefined)
  };

  (verifyService.verifyChainToGateway as jest.Mock).mockResolvedValue(mockGatewayRepo);
  (SensorRepository as jest.Mock).mockImplementation(() => mockSensorRepo);

  await sensorController.createSensor(networkCode, gatewayMac, sensorDto);

  expect(mockSensorRepo.getSensorByMac).toHaveBeenCalledWith(sensorDto.macAddress);
  expect(mockSensorRepo.createSensor).toHaveBeenCalledWith(
    sensorDto.macAddress,
    sensorDto.name,
    sensorDto.description,
    sensorDto.variable,
    sensorDto.unit,
    fakeGateway.id
  );
});

it("updateSensor - aggiorna sensore se non ci sono conflitti", async () => {
  const networkCode = "net01";
  const gatewayMac = "1:2:3:4:5:6";
  const sensorMac = "11:22:33:44:55:66";

  const sensorDto = {
    macAddress: sensorMac,
    name: "updated sensor",
    description: "updated desc",
    variable: "humidity",
    unit: "%"
  };

  const mockSensorRepo = {
    getSensorByMac: jest.fn().mockResolvedValue({ macAddress: sensorMac }), // stesso sensore, no conflitto
    updateSensor: jest.fn().mockResolvedValue(undefined)
  };

  (verifyService.verifyChainToSensor as jest.Mock).mockResolvedValue(mockSensorRepo);

  await sensorController.updateSensor(networkCode, gatewayMac, sensorMac, sensorDto);

  expect(mockSensorRepo.getSensorByMac).toHaveBeenCalledWith(sensorDto.macAddress);
  expect(mockSensorRepo.updateSensor).toHaveBeenCalledWith(sensorMac, sensorDto);
});

it("deleteSensor", async () => {
  const networkCode = "net01";
  const gatewayMac = "1:2:3:4:5:6";
  const sensorMac = "11:22:33:44:55:66";
    
  const mockSensorRepo = {
    deleteSensor: jest.fn().mockResolvedValue(undefined)
  };
    
  (verifyService.verifyChainToSensor as jest.Mock).mockResolvedValue(mockSensorRepo);
    
  await sensorController.deleteSensor(networkCode, gatewayMac, sensorMac);
    
  expect(verifyService.verifyChainToSensor).toHaveBeenCalledWith(networkCode, gatewayMac, sensorMac);
  expect(mockSensorRepo.deleteSensor).toHaveBeenCalledWith(sensorMac);
});