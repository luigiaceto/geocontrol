import * as sensorController from "@controllers/sensorController";
import { SensorDAO } from "@dao/SensorDAO";
import { GatewayDAO } from "@dao/GatewayDAO";
import { NetworkDAO } from "@dao/NetworkDAO";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { SensorRepository } from "@repositories/SensorRepository";
import { NotFoundError } from "@models/errors/NotFoundError";

jest.mock("@repositories/NetworkRepository");
jest.mock("@repositories/GatewayRepository");
jest.mock("@repositories/SensorRepository");

// verifyService e i mapper service vengono testatti unit 
// in test suite apposite. Il conntroller è praticamente
// privo di logica quindi non viene testato unit.
describe("sensorController integration", () => {
  it("getSensorByMac: integration with verifyChainToSensor and mapperService", async () => {
    const networkCode = "net01";
    const gatewayMac = "1:2:3:4:5:6";
    const sensorMac = "11:22:33:44:55:66";
    
    const fakeSensor = new SensorDAO();
    fakeSensor.macAddress = sensorMac;
    fakeSensor.name = "s01";
    fakeSensor.description = "desc";
    fakeSensor.variable = "temperature";
    fakeSensor.unit = "°C";
    fakeSensor.gatewayId = 1;
    
    const fakeGateway = new GatewayDAO();
    fakeGateway.macAddress = gatewayMac;
    fakeGateway.name = "gw01";
    fakeGateway.description = "desc";
    fakeGateway.sensors = [fakeSensor];
    fakeGateway.networkId = 1;
    
    const fakeNetwork = new NetworkDAO();
    fakeNetwork.code = networkCode;
    fakeNetwork.name = "net01";
    fakeNetwork.description = "desc";
    fakeNetwork.gateways = [fakeGateway];

    const expectedDTO = {
      macAddress: fakeSensor.macAddress,
      name: fakeSensor.name,
      description: fakeSensor.description,
      variable: fakeSensor.variable,
      unit: fakeSensor.unit
    };
    
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getNetworkByCode: jest.fn().mockResolvedValue(fakeNetwork)
    }));
    
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      getGatewayByMac: jest.fn().mockResolvedValue(fakeGateway)
    }));
    
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      getSensorByMac: jest.fn().mockResolvedValue(fakeSensor)
    }));
    
    const result = await sensorController.getSensorByMac(networkCode, gatewayMac, sensorMac);
    
    expect(result).toEqual(expectedDTO);
    expect(NetworkRepository).toHaveBeenCalled();
    expect(GatewayRepository).toHaveBeenCalled();
    expect(SensorRepository).toHaveBeenCalled();
  });

  it("getSensorByMac: throw NotFoundError when gateway not in network", async () => {
    const networkCode = "net01";
    const gatewayMac = "1:2:3:4:5:6";
    const sensorMac = "11:22:33:44:55:66";
    
    const fakeSensor = new SensorDAO();
    fakeSensor.macAddress = sensorMac;
    fakeSensor.name = "s01";
    fakeSensor.description = "desc";
    fakeSensor.variable = "temperature";
    fakeSensor.unit = "°C";
    fakeSensor.gatewayId = 1;
    
    const fakeGateway = new GatewayDAO();
    fakeGateway.macAddress = gatewayMac;
    fakeGateway.name = "gw01";
    fakeGateway.description = "desc";
    fakeGateway.sensors = [fakeSensor];
    fakeGateway.networkId = 1;
    
    const fakeNetwork = new NetworkDAO();
    fakeNetwork.code = networkCode;
    fakeNetwork.name = "net01";
    fakeNetwork.description = "desc";
    fakeNetwork.gateways = [];
    
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getNetworkByCode: jest.fn().mockResolvedValue(fakeNetwork)
    }));
    
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      getGatewayByMac: jest.fn().mockResolvedValue(fakeGateway)
    }));
    
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      getSensorByMac: jest.fn().mockResolvedValue(fakeSensor)
    }));
    
    await expect(sensorController.getSensorByMac(networkCode, gatewayMac, sensorMac))
      .rejects.toThrow(NotFoundError);
  });

   it("getSensorsByGateway: integration with verifyChainToGateway", async () => {
    const networkCode = "net01";
    const gatewayMac = "1:2:3:4:5:6";
    
    const fakeSensor1 = new SensorDAO();
    fakeSensor1.macAddress = "11:22:33:44:55:66";
    fakeSensor1.name = "s01";
    fakeSensor1.description = "desc1";
    fakeSensor1.variable = "temperature";
    fakeSensor1.unit = "°C";
    fakeSensor1.gatewayId = 1;
    
    const fakeSensor2 = new SensorDAO();
    fakeSensor2.macAddress = "11:22:33:44:55:67";
    fakeSensor2.name = "s02";
    fakeSensor2.description = "desc2";
    fakeSensor2.variable = "humidity";
    fakeSensor2.unit = "%";
    fakeSensor2.gatewayId = 1;
    
    const fakeGateway = new GatewayDAO();
    fakeGateway.id = 1;
    fakeGateway.macAddress = gatewayMac;
    fakeGateway.name = "gw01";
    fakeGateway.description = "desc";
    fakeGateway.sensors = [fakeSensor1, fakeSensor2];
    fakeGateway.networkId = 1;
    
    const fakeNetwork = new NetworkDAO();
    fakeNetwork.code = networkCode;
    fakeNetwork.name = "net01";
    fakeNetwork.description = "desc";
    fakeNetwork.gateways = [fakeGateway];

    const expectedDTOs = [
      {
        macAddress: fakeSensor1.macAddress,
        name: fakeSensor1.name,
        description: fakeSensor1.description,
        variable: fakeSensor1.variable,
        unit: fakeSensor1.unit
      },
      {
        macAddress: fakeSensor2.macAddress,
        name: fakeSensor2.name,
        description: fakeSensor2.description,
        variable: fakeSensor2.variable,
        unit: fakeSensor2.unit
      }
    ];
    
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getNetworkByCode: jest.fn().mockResolvedValue(fakeNetwork)
    }));
    
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      getGatewayByMac: jest.fn().mockResolvedValue(fakeGateway)
    }));
    
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      getSensorsByGatewayId: jest.fn().mockResolvedValue([fakeSensor1, fakeSensor2])
    }));
    
    const result = await sensorController.getSensorsByGateway(networkCode, gatewayMac);
    
    expect(result).toEqual(expectedDTOs);
    expect(result).toHaveLength(2);
  });
});