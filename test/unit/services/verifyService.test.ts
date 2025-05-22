import { verifyChainToGateway, verifyChainToSensor } from "@services/verifyService";
import { NotFoundError } from "@errors/NotFoundError";

const mockGetNetworkByCode = jest.fn();
const mockGetGatewayByMac = jest.fn();
const mockGetSensorByMac = jest.fn();

jest.mock("@repositories/NetworkRepository", () => {
  return {
    NetworkRepository: jest.fn().mockImplementation(() => ({
      getNetworkByCode: mockGetNetworkByCode,
    })),
  };
});
jest.mock("@repositories/GatewayRepository", () => {
  return {
    GatewayRepository: jest.fn().mockImplementation(() => ({
      getGatewayByMac: mockGetGatewayByMac,
    })),
  };
});
jest.mock("@repositories/SensorRepository", () => {
  return {
    SensorRepository: jest.fn().mockImplementation(() => ({
      getSensorByMac: mockGetSensorByMac,
    })),
  };
});

describe("verifyService: mocked repos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("verifyChainToGateway", () => {
    it("returns GatewayRepository when gateway is in network", async () => {
      mockGetNetworkByCode.mockResolvedValue({ gateways: [{ macAddress: "GW1" }] });
      mockGetGatewayByMac.mockResolvedValue({ macAddress: "GW1" });

      const repo = await verifyChainToGateway("NET1", "GW1");
      expect(repo).toBeDefined();
    });

    it("throws NotFoundError if gateway not in network", async () => {
      mockGetNetworkByCode.mockResolvedValue({ gateways: [{ macAddress: "GW2" }] });
      mockGetGatewayByMac.mockResolvedValue({ macAddress: "GW1" });

      await expect(verifyChainToGateway("NET1", "GW1")).rejects.toThrow(NotFoundError);
    });
  });

    describe("verifyChainToSensor", () => {
        it("returns SensorRepository when sensor is in gateway", async () => {
        mockGetNetworkByCode.mockResolvedValue({ gateways: [{ macAddress: "GW1" }] });
        mockGetGatewayByMac.mockResolvedValue({ macAddress: "GW1", sensors: [{ macAddress: "S1" }] });
        mockGetSensorByMac.mockResolvedValue({ macAddress: "S1" });
    
        const repo = await verifyChainToSensor("NET1", "GW1", "S1");
        expect(repo).toBeDefined();
        });

        it("throws NotFoundError if gateway not in network", async () => {
        mockGetNetworkByCode.mockResolvedValue({ gateways: [{ macAddress: "GW2" }] });
        mockGetGatewayByMac.mockResolvedValue({ macAddress: "GW1", sensors: [{ macAddress: "S1" }] });  
        mockGetSensorByMac.mockResolvedValue({ macAddress: "S1" });
        
        await expect(verifyChainToSensor("NET1", "GW1", "S1")).rejects.toThrow(NotFoundError);
        });
    
        it("throws NotFoundError if sensor not in gateway", async () => {
        mockGetNetworkByCode.mockResolvedValue({ gateways: [{ macAddress: "GW1" }] });
        mockGetGatewayByMac.mockResolvedValue({ macAddress: "GW1", sensors: [{ macAddress: "S2" }] });
        mockGetSensorByMac.mockResolvedValue({ macAddress: "S1" });
    
        await expect(verifyChainToSensor("NET1", "GW1", "S1")).rejects.toThrow(NotFoundError);
        });
    });

 
});