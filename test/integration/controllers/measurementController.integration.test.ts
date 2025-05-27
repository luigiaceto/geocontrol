import * as measurementController from "@controllers/measurementController";
import { MeasurementDAO } from "@models/dao/MeasurementDAO";
import { SensorDAO } from "@models/dao/SensorDAO";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { MeasurementRepository } from "@repositories/MeasurementRepository";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { SensorRepository } from "@repositories/SensorRepository";
import * as verifyService from "@services/verifyService";
import * as mapperService from "@services/mapperService";

jest.mock("@repositories/MeasurementRepository");
jest.mock("@repositories/NetworkRepository");
jest.mock("@repositories/SensorRepository");
jest.mock("@services/verifyService");
jest.mock("@services/mapperService");

describe("measurementController integration", () => {
  const networkCode = "net01";
  const gatewayMac = "1:2:3:4:5:6";
  const sensorMac = "11:22:33:44:55:66";
  const startDate = "2024-01-01T00:00:00Z";
  const endDate = "2024-01-02T00:00:00Z";

  const fakeSensor = new SensorDAO();
  fakeSensor.id = 1;
  fakeSensor.macAddress = sensorMac;
  fakeSensor.name = "s01";
  fakeSensor.description = "desc";
  fakeSensor.variable = "temperature";
  fakeSensor.unit = "°C";
  fakeSensor.gatewayId = 1;

  const fakeGateway = new GatewayDAO();
  fakeGateway.id = 1;
  fakeGateway.macAddress = gatewayMac;
  fakeGateway.sensors = [fakeSensor];
  fakeGateway.networkId = 1;

  const fakeNetwork = new NetworkDAO();
  fakeNetwork.code = networkCode;
  fakeNetwork.gateways = [fakeGateway];

  const fakeMeasurement = new MeasurementDAO();
  fakeMeasurement.id = 1;
  fakeMeasurement.value = 25.5;
  fakeMeasurement.createdAt = new Date(startDate);
  fakeMeasurement.sensorId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getMeasurementsOfNetwork: returns measurements for sensors in network", async () => {
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getNetworkByCode: jest.fn().mockResolvedValue(fakeNetwork)
    }));
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      getSensorByMac: jest.fn().mockResolvedValue(fakeSensor)
    }));
    (MeasurementRepository as jest.Mock).mockImplementation(() => ({
      getMeasurementsBySensorId: jest.fn().mockResolvedValue([fakeMeasurement])
    }));
    (mapperService.mapToMeasurementsDTO as jest.Mock).mockReturnValue({ sensorMacAddress: sensorMac, measurements: [fakeMeasurement] });

    const result = await measurementController.getMeasurementsOfNetwork(networkCode, [sensorMac], startDate, endDate);

    expect(result).toHaveLength(1);
    expect(result[0].sensorMacAddress).toBe(sensorMac);
    expect(NetworkRepository).toHaveBeenCalled();
    expect(SensorRepository).toHaveBeenCalled();
    expect(MeasurementRepository).toHaveBeenCalled();
    expect(mapperService.mapToMeasurementsDTO).toHaveBeenCalled();
  });

  it("getStatsOfNetwork: returns stats for sensors in network", async () => {
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getNetworkByCode: jest.fn().mockResolvedValue(fakeNetwork)
    }));
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      getSensorByMac: jest.fn().mockResolvedValue(fakeSensor)
    }));
    (MeasurementRepository as jest.Mock).mockImplementation(() => ({
      getMeasurementsBySensorId: jest.fn().mockResolvedValue([fakeMeasurement])
    }));
    (mapperService.maptToStatisticsDTOForNetwork as jest.Mock).mockReturnValue({ sensorMacAddress: sensorMac, mean: 25.5 });

    const result = await measurementController.getStatsOfNetwork(networkCode, [sensorMac], startDate, endDate);

    expect(result).toHaveLength(1);
    expect(result[0].sensorMacAddress).toBe(sensorMac);
    expect(mapperService.maptToStatisticsDTOForNetwork).toHaveBeenCalled();
  });

  it("getOutliersMeasurementsOfNetwork: returns outliers for sensors in network", async () => {
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getNetworkByCode: jest.fn().mockResolvedValue(fakeNetwork)
    }));
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      getSensorByMac: jest.fn().mockResolvedValue(fakeSensor)
    }));
    (MeasurementRepository as jest.Mock).mockImplementation(() => ({
      getMeasurementsBySensorId: jest.fn().mockResolvedValue([fakeMeasurement])
    }));
    (mapperService.mapToMeasurementsDTOOutliers as jest.Mock).mockReturnValue({ sensorMacAddress: sensorMac, outliers: [] });

    const result = await measurementController.getOutliersMeasurementsOfNetwork(networkCode, [sensorMac], startDate, endDate);

    expect(result).toHaveLength(1);
    expect(result[0].sensorMacAddress).toBe(sensorMac);
    expect(mapperService.mapToMeasurementsDTOOutliers).toHaveBeenCalled();
  });

  it("getMeasurementsOfSensor: integration with verifyChainToSensor and mapperService", async () => {
    const fakeSensorRepo = {
      getSensorByMac: jest.fn().mockResolvedValue(fakeSensor)
    };
    (verifyService.verifyChainToSensor as jest.Mock).mockResolvedValue(fakeSensorRepo);
    (MeasurementRepository as jest.Mock).mockImplementation(() => ({
      getMeasurementsBySensorId: jest.fn().mockResolvedValue([fakeMeasurement])
    }));
    (mapperService.mapToMeasurementsDTO as jest.Mock).mockReturnValue({ sensorMacAddress: sensorMac, measurements: [fakeMeasurement] });

    const result = await measurementController.getMeasurementsOfSensor(networkCode, gatewayMac, sensorMac, startDate, endDate);

    expect(result.sensorMacAddress).toBe(sensorMac);
    expect(verifyService.verifyChainToSensor).toHaveBeenCalled();
    expect(mapperService.mapToMeasurementsDTO).toHaveBeenCalled();
  });

  it("getStatsOfSensor: integration with verifyChainToSensor and mapperService", async () => {
    const fakeSensorRepo = {
      getSensorByMac: jest.fn().mockResolvedValue(fakeSensor)
    };
    (verifyService.verifyChainToSensor as jest.Mock).mockResolvedValue(fakeSensorRepo);
    (MeasurementRepository as jest.Mock).mockImplementation(() => ({
      getMeasurementsBySensorId: jest.fn().mockResolvedValue([fakeMeasurement])
    }));
    (mapperService.mapToStatsDTO as jest.Mock).mockReturnValue({ mean: 25.5 });

    const result = await measurementController.getStatsOfSensor(networkCode, gatewayMac, sensorMac, startDate, endDate);

    expect(result.mean).toBe(25.5);
    expect(verifyService.verifyChainToSensor).toHaveBeenCalled();
    expect(mapperService.mapToStatsDTO).toHaveBeenCalled();
  });

  it("getOutliersMeasurementsOfSensor: integration with verifyChainToSensor and mapperService", async () => {
    const fakeSensorRepo = {
    getSensorByMac: jest.fn().mockResolvedValue(fakeSensor)
    };
    (verifyService.verifyChainToSensor as jest.Mock).mockResolvedValue(fakeSensorRepo);
    (MeasurementRepository as jest.Mock).mockImplementation(() => ({
    getMeasurementsBySensorId: jest.fn().mockResolvedValue([fakeMeasurement])
    }));
    (mapperService.mapToMeasurementsDTOOutliers as jest.Mock).mockReturnValue({ sensorMacAddress: sensorMac, outliers: [] });

    const result = await measurementController.getOutliersMeasurementsOfSensor(networkCode, gatewayMac, sensorMac, startDate, endDate);

    expect(result.sensorMacAddress).toBe(sensorMac);
    expect(verifyService.verifyChainToSensor).toHaveBeenCalled();
    expect(mapperService.mapToMeasurementsDTOOutliers).toHaveBeenCalled();
    });

    it("getOutliersMeasurementsOfNetwork: returns [] when no sensors are found", async () => {
    // Setup: nessun sensore valido
    // Usa un MAC che sicuramente non esiste
    const nonexistentSensorMac = "00:00:00:00:00:00";

    // Nessun bisogno di mockare verifySensors, ma devi assicurarti che
    // SensorRepository.getSensorByMac ritorni null o undefined
    (SensorRepository as jest.Mock).mockImplementation(() => ({
        getSensorByMac: jest.fn().mockResolvedValue(undefined),
    }));

    // NetworkRepository deve comunque restituire una rete valida
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
        getNetworkByCode: jest.fn().mockResolvedValue(fakeNetwork),
    }));

    const result = await measurementController.getOutliersMeasurementsOfNetwork(
        networkCode,
        [nonexistentSensorMac],
        startDate,
        endDate
    );

    expect(result).toEqual([]);
    });

    it("getStatsOfNetwork: returns [] when no sensors are found", async () => {
        const nonexistentSensorMac = "00:00:00:00:00:00";
        (SensorRepository as jest.Mock).mockImplementation(() => ({
            getSensorByMac: jest.fn().mockResolvedValue(undefined),
            }));
        
        (NetworkRepository as jest.Mock).mockImplementation(() => ({
            getNetworkByCode: jest.fn().mockResolvedValue(fakeNetwork),
        }));
        const result = await measurementController.getStatsOfNetwork(
            networkCode,
            [nonexistentSensorMac],
            startDate,
            endDate
        );
        expect(result).toEqual([]);
    });

    it("getMeasurementsOfNetwork: returns [] when no sensors are found", async () => {
        const nonexistentSensorMac = "00:00:00:00:00:00";
        (SensorRepository as jest.Mock).mockImplementation(() => ({
            getSensorByMac: jest.fn().mockResolvedValue(undefined),
        }));
        
        (NetworkRepository as jest.Mock).mockImplementation(() => ({
            getNetworkByCode: jest.fn().mockResolvedValue(fakeNetwork),
        }));
        
        const result = await measurementController.getMeasurementsOfNetwork(
            networkCode,
            [nonexistentSensorMac],
            startDate,
            endDate
        );
        
        expect(result).toEqual([]);
    });
});
