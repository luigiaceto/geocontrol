import { getNetwork } from "@controllers/networkController"; 
import { NetworkRepository } from "@repositories/NetworkRepository";
import { mapNetworkDAOToDTO } from "@services/mapperService";
import { GatewayDAO } from "@dao/GatewayDAO";
import { NetworkDAO } from "@dao/NetworkDAO";
import { SensorDAO } from "@dao/SensorDAO";

jest.mock("@repositories/NetworkRepository");
jest.mock("@services/mapperService");

describe("networkController integration", () => {
  it("getNetwork: integration with NetworkRepository and mapNetworkDAOToDTO", async () => {
    const networkCode = "net01";

    const fakeSensor = new SensorDAO();
    fakeSensor.macAddress = "11:22:33:44:55:66";
    fakeSensor.name = "s01";
    fakeSensor.description = "desc";
    fakeSensor.variable = "temperature";
    fakeSensor.unit = "°C";
    fakeSensor.gatewayId = 1;

    const fakeGateway = new GatewayDAO();
    fakeGateway.macAddress = "1:2:3:4:5:6";
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
      code: fakeNetwork.code,
      name: fakeNetwork.name,
      description: fakeNetwork.description,
      gateways: [
        {
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
        }
      ]
    };

    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getNetworkByCode: jest.fn().mockResolvedValue(fakeNetwork)
    }));

    (mapNetworkDAOToDTO as jest.Mock).mockReturnValue(expectedDTO);

    const result = await getNetwork(networkCode);

    expect(NetworkRepository).toHaveBeenCalled();
    expect(mapNetworkDAOToDTO).toHaveBeenCalledWith(fakeNetwork);
    expect(result).toEqual(expectedDTO);
  });
});
