import * as gatewayController from "@controllers/gatewayController";
import { GatewayDAO } from "@dao/GatewayDAO";
import { NetworkDAO } from "@dao/NetworkDAO";
import { SensorDAO } from "@dao/SensorDAO";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { NotFoundError } from "@models/errors/NotFoundError";

jest.mock("@repositories/NetworkRepository");
jest.mock("@repositories/GatewayRepository");

describe("gatewayController integration", () => {
  it("getAllGateways: integration with NetworkRepository and GatewayRepository", async () => {
    const networkCode = "net01";

    const fakeGateway1 = new GatewayDAO();
    fakeGateway1.macAddress = "1:2:3:4:5:6";
    fakeGateway1.name = "gw01";
    fakeGateway1.description = "desc1";
    fakeGateway1.networkId = 1;
    fakeGateway1.sensors = [];

    const fakeGateway2 = new GatewayDAO();
    fakeGateway2.macAddress = "1:2:3:4:5:7";
    fakeGateway2.name = "gw02";
    fakeGateway2.description = "desc2";
    fakeGateway2.networkId = 1;
    fakeGateway2.sensors = [];

    const fakeNetwork = new NetworkDAO();
    fakeNetwork.code = networkCode;
    fakeNetwork.name = "net01";
    fakeNetwork.description = "desc";
    fakeNetwork.gateways = [fakeGateway1, fakeGateway2];

    const expectedDTOs = [
      {
        macAddress: fakeGateway1.macAddress,
        name: fakeGateway1.name,
        description: fakeGateway1.description
      },
      {
        macAddress: fakeGateway2.macAddress,
        name: fakeGateway2.name,
        description: fakeGateway2.description
      }
    ];


    (NetworkRepository as jest.Mock).mockImplementation(() => ({
        getNetworkByCode: jest.fn().mockResolvedValue(fakeNetwork)
    }));

    (GatewayRepository as jest.Mock).mockImplementation(() => ({
        getGatewaysByNetworkId: jest.fn().mockResolvedValue([fakeGateway1, fakeGateway2])
    }));

    const result = await gatewayController.getAllGateways(networkCode);

    expect(result).toEqual(expectedDTOs);
    expect(result).toHaveLength(2);
  });

  it("getGateway: integration with verifyChainToGateway and mapperService", async () => {
    const networkCode = "net01";
    const gatewayMac = "1:2:3:4:5:6";
    
    const fakeSensor = new SensorDAO();
    fakeSensor.macAddress = "11:22:33:44:55:66";
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
    fakeGateway.networkId = 1;

    const expectedDTO = {
        macAddress: fakeGateway.macAddress,
        name: fakeGateway.name,
        description: fakeGateway.description,
        sensors: [
          {
            macAddress: fakeSensor.macAddress,
            name: fakeSensor.name,
            description: fakeSensor.description,
            variable: fakeSensor.variable,
            unit: fakeSensor.unit
          }
        ]
    };

    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getNetworkByCode: jest.fn().mockResolvedValue(fakeNetwork)
    }));
    
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      getGatewayByMac: jest.fn().mockResolvedValue(fakeGateway)
    }));

    const result = await gatewayController.getGateway(networkCode, gatewayMac);

    expect(result).toEqual(expectedDTO);
    expect(NetworkRepository).toHaveBeenCalled();
    expect(GatewayRepository).toHaveBeenCalled();

  });

  it("getGateway: throw NotFoundError when gateway not in network", async () => {
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
    

    await expect(gatewayController.getGateway(networkCode, gatewayMac)).rejects.toThrow(NotFoundError);
  });
});