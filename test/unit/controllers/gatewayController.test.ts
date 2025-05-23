import * as gatewayController from "@controllers/gatewayController";
import { NetworkDAO } from "@dao/NetworkDAO";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { NetworkRepository } from "@repositories/NetworkRepository";
import * as verifyService from "@services/verifyService";

jest.mock("@services/verifyService");
jest.mock("@repositories/NetworkRepository");
jest.mock("@repositories/GatewayRepository");

it("createGateway", async () => {
    const networkCode = "net01";
    const gatewayDto = {
      macAddress: "1:2:3:4:5:6",
      name: "gw01", 
      description: "desc",
      sensors: []
    };

    const fakeNetwork = new NetworkDAO();
    fakeNetwork.id = 1;
    fakeNetwork.code = networkCode;

    const mockNetworkRepo = {
      getNetworkByCode: jest.fn().mockResolvedValue(fakeNetwork)
    };

    const mockGatewayRepo = {
      createGateway: jest.fn().mockResolvedValue(undefined)
    };

    (NetworkRepository as jest.Mock).mockImplementation(() => mockNetworkRepo);
    (GatewayRepository as jest.Mock).mockImplementation(() => mockGatewayRepo);

    await gatewayController.createGateway(networkCode, gatewayDto);

    expect(mockNetworkRepo.getNetworkByCode).toHaveBeenCalledWith(networkCode);
    expect(mockGatewayRepo.createGateway).toHaveBeenCalledWith(
      gatewayDto.macAddress,
      gatewayDto.name,
      gatewayDto.description,
      fakeNetwork.id
    );

});

it("updateGateway", async () => {
    const networkCode = "net01";
    const macAddress = "1:2:3:4:5:6";

    const gatewayDTO = {
      macAddress: macAddress,
      name: "Updated Gateway",
      description: "Updated description",
      sensors: []
    };

    const mockGatewayRepo = {
      updateGateway: jest.fn().mockResolvedValue(undefined)
    };

    (verifyService.verifyChainToGateway as jest.Mock).mockResolvedValue(mockGatewayRepo);

    await gatewayController.updateGateway(networkCode, macAddress, gatewayDTO);

    expect(verifyService.verifyChainToGateway).toHaveBeenCalledWith(networkCode, macAddress);

    expect(mockGatewayRepo.updateGateway).toHaveBeenCalledWith(macAddress, gatewayDTO);
});

it("deleteGateway", async() => {
    const networkCode = "net01";
    const macAddress = "1:2:3:4:5:6";

    const mockGatewayRepo = {
      deleteGateway: jest.fn().mockResolvedValue(undefined)
    };

    (verifyService.verifyChainToGateway as jest.Mock).mockResolvedValue(mockGatewayRepo);

    await gatewayController.deleteGateway(networkCode, macAddress);

     expect(mockGatewayRepo.deleteGateway).toHaveBeenCalledWith(macAddress);
});