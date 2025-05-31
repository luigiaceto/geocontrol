import * as sensorController from "@controllers/sensorController";
import { GatewayDAO } from "@dao/GatewayDAO";
import { NotFoundError } from "@models/errors/NotFoundError";
import { SensorRepository } from "@repositories/SensorRepository";
import * as verifyService from "@services/verifyService";

jest.mock("@services/verifyService");
jest.mock("@repositories/NetworkRepository");
jest.mock("@repositories/GatewayRepository");
jest.mock("@repositories/SensorRepository");

it("createSensor", async () => {
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
    createSensor: jest.fn().mockResolvedValue(undefined)
  };

  // permette di simulare le due chiamate alla getGatewayByMac:
  // - dentro il controller, dentro verifyService -> serve per la verifica
  //   della catena
  // - dentro il controller -> serve per verificare che non venga creato un
  //  sensore con un MAC già in utilizzo da un gateway
  mockGatewayRepo.getGatewayByMac.mockImplementation((mac) => {
    if (mac === sensorDto.macAddress) {
      throw new NotFoundError("Gateway with MAC not found");
    }
    return Promise.resolve(fakeGateway);
  });

  (verifyService.verifyChainToGateway as jest.Mock).mockResolvedValue(mockGatewayRepo);
  (SensorRepository as jest.Mock).mockImplementation(() => mockSensorRepo);
    
  await sensorController.createSensor(networkCode, gatewayMac, sensorDto);
    
  expect(verifyService.verifyChainToGateway).toHaveBeenCalledWith(networkCode, gatewayMac);
  expect(mockGatewayRepo.getGatewayByMac).toHaveBeenCalledWith(gatewayMac);
  expect(mockGatewayRepo.getGatewayByMac).toHaveBeenCalledWith(sensorDto.macAddress);
  expect(mockSensorRepo.createSensor).toHaveBeenCalledWith(
    sensorDto.macAddress,
    sensorDto.name,
    sensorDto.description,
    sensorDto.variable,
    sensorDto.unit,
    fakeGateway.id
  );
});

it("updateSensor", async () => {
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

  const mockGatewayRepo = {
    getGatewayByMac: jest.fn().mockImplementation((mac) => {
      if (mac === sensorDto.macAddress) {
        throw new NotFoundError("Gateway with MAC not found");
      }
      return Promise.resolve({});
    })
  };

  const mockSensorRepo = {
    updateSensor: jest.fn().mockResolvedValue(undefined)
  };

  (verifyService.verifyChainToGateway as jest.Mock).mockResolvedValue(mockGatewayRepo);
  (verifyService.verifyChainToSensor as jest.Mock).mockResolvedValue(mockSensorRepo);
  await sensorController.updateSensor(networkCode, gatewayMac, sensorMac, sensorDto);
  expect(verifyService.verifyChainToGateway).toHaveBeenCalledWith(networkCode, gatewayMac);
  expect(mockGatewayRepo.getGatewayByMac).toHaveBeenCalledWith(sensorDto.macAddress);
  expect(verifyService.verifyChainToSensor).toHaveBeenCalledWith(networkCode, gatewayMac, sensorMac);
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