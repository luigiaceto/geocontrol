import * as measurementController from "@controllers/measurementController";
import { MeasurementRepository } from "@repositories/MeasurementRepository";
import { SensorRepository } from "@repositories/SensorRepository";
import * as verifyService from "@services/verifyService";
import * as mapperService from "@services/mapperService";
import { MeasurementDAO } from "@models/dao/MeasurementDAO";

jest.mock("@services/verifyService");
jest.mock("@repositories/MeasurementRepository");
jest.mock("@repositories/SensorRepository");
jest.mock("@services/mapperService");

describe("measurementController", () => {
  const networkCode = "net01";
  const gatewayMac = "1:2:3:4:5:6";
  const sensorMac = "11:22:33:44:55:66";
  const sensorId = 42;

  beforeEach(() => {
    jest.clearAllMocks();
  });
 

   it("storeMeasurements", async () => {
    const mockSensorRepo = {
      getSensorByMac: jest.fn().mockResolvedValue({ id: sensorId })
    };
    const mockMeasurementRepo = {
      storeMeasurement: jest.fn().mockResolvedValue(undefined)
    };
    (verifyService.verifyChainToSensor as jest.Mock).mockResolvedValue(mockSensorRepo);
    (MeasurementRepository as jest.Mock).mockImplementation(() => mockMeasurementRepo);

    const measurements = [
      { createdAt: new Date("2024-01-01"), value: 10 },
      { createdAt: new Date("2024-01-02"), value: 20 }
    ];

    await measurementController.storeMeasurements(networkCode, gatewayMac, sensorMac, measurements);

    expect(verifyService.verifyChainToSensor).toHaveBeenCalledWith(networkCode, gatewayMac, sensorMac);
    expect(mockSensorRepo.getSensorByMac).toHaveBeenCalledWith(sensorMac);
    expect(mockMeasurementRepo.storeMeasurement).toHaveBeenCalledTimes(2);
    expect(mockMeasurementRepo.storeMeasurement).toHaveBeenCalledWith(measurements[0].createdAt, measurements[0].value, sensorId);
    expect(mockMeasurementRepo.storeMeasurement).toHaveBeenCalledWith(measurements[1].createdAt, measurements[1].value, sensorId);
  });
});
