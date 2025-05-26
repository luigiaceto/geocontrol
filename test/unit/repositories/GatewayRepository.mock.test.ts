import { GatewayRepository } from "@repositories/GatewayRepository";
import { GatewayDAO } from "@dao/GatewayDAO";
import { NotFoundError } from "@models/errors/NotFoundError";
import { ConflictError } from "@models/errors/ConflictError";

const mockFind = jest.fn();
const mockSave = jest.fn();
const mockRemove = jest.fn();

jest.mock("@database", () => ({
  AppDataSource: {
    getRepository: () => ({
      find: mockFind,
      save: mockSave,
      remove: mockRemove
    }),
  }
}));

describe("Gateway Repository: mocked database", () => {
    const repo = new GatewayRepository();
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("create gateway", async () => {
        mockFind.mockResolvedValue([]);

        const savedGateway = new GatewayDAO();
        savedGateway.macAddress = '14:14:14:14';
        savedGateway.name = 'g01';
        savedGateway.description = 'hi';
        savedGateway.networkId = 14;

        mockSave.mockResolvedValue(savedGateway);

        const result = await repo.createGateway('14:14:14:14', 'g01', 'hi', 14);

        expect(result).toBeInstanceOf(GatewayDAO);
        expect(result).toMatchObject({
            macAddress: '14:14:14:14',
            name: 'g01',
            description: 'hi',
            networkId: 14
        });
        expect(mockSave).toHaveBeenCalledWith({
            macAddress: '14:14:14:14',
            name: 'g01',
            description: 'hi',
            networkId: 14
        });
    });

    it("create gateway: conflict", async () => {
        const existingGateway = new GatewayDAO();
        existingGateway.macAddress = '14:14:14:14';
        existingGateway.name = 'g01';
        existingGateway.description = 'hi';
        existingGateway.networkId = 14;

        mockFind.mockResolvedValue([existingGateway]);

        await expect(repo.createGateway('14:14:14:14', 'g02', 'hi', 14)).rejects.toThrow(ConflictError);
    });

    it("get gateway by mac", async () => {
        const foundGateway = new GatewayDAO();
        foundGateway.macAddress = '14:14:14:14';
        foundGateway.name = 'g01';
        foundGateway.description = 'hi';
        foundGateway.networkId = 14;

        mockFind.mockResolvedValue([foundGateway]);

        const result = await repo.getGatewayByMac('14:14:14:14');
        expect(result).toBe(foundGateway);
        expect(result.macAddress).toBe('14:14:14:14');
    });

    it("get gateway by mac: NotFoundError", async () => {
        mockFind.mockResolvedValue([]);

        await expect(repo.getGatewayByMac('14:14:14:14')).rejects.toThrow(NotFoundError);
    });

    it("get gateways by networkId", async () => {
        const foundGateway1 = new GatewayDAO();
        foundGateway1.macAddress = '14:14:14:14';
        foundGateway1.name = 'g01';
        foundGateway1.description = 'hi';
        foundGateway1.networkId = 14;

        const foundGateway2 = new GatewayDAO();
        foundGateway2.macAddress = '15:15:15:15';
        foundGateway2.name = 'g02';
        foundGateway2.description = 'hi';
        foundGateway2.networkId = 14;

        mockFind.mockResolvedValue([foundGateway1, foundGateway2]);

        const result = await repo.getGatewaysByNetworkId(14);
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(foundGateway1);
        expect(result).toContainEqual(foundGateway2);
        expect(mockFind).toHaveBeenCalledWith({ where: { networkId: 14 } });
    });

    it("update gateway: macAddress", async () => {
        const existingGateway = new GatewayDAO();
        existingGateway.macAddress = '14:14:14:14';
        existingGateway.name = 'g01';
        existingGateway.description = 'hi';
        existingGateway.networkId = 14;

        mockFind.mockResolvedValueOnce([existingGateway]);
        mockFind.mockResolvedValueOnce([]);

        const updatedGateway = new GatewayDAO();
        updatedGateway.macAddress = '15:15:15:15';
        updatedGateway.name = 'g01';
        updatedGateway.description = 'hi';
        updatedGateway.networkId = 14;

        mockSave.mockResolvedValue(updatedGateway);

        const result = await repo.updateGateway('14:14:14:14', { 
            macAddress: '15:15:15:15',
            name: 'g01',
            description: 'hi'
        });

        expect(result.macAddress).toBe('15:15:15:15');
        expect(mockSave).toHaveBeenCalled();
    });

    it("update gateway: NotMacAddress", async () => {
        const existingGateway = new GatewayDAO();
        existingGateway.macAddress = '14:14:14:14';
        existingGateway.name = 'g01';
        existingGateway.description = 'hi';
        existingGateway.networkId = 14;

        mockFind.mockResolvedValue([existingGateway]);

        const updatedGateway = new GatewayDAO();
        updatedGateway.macAddress = '14:14:14:14';
        updatedGateway.name = 'g02';
        updatedGateway.description = 'hi';
        updatedGateway.networkId = 14;

        mockSave.mockResolvedValue(updatedGateway);

        const result = await repo.updateGateway('14:14:14:14', { 
            macAddress: '14:14:14:14',
            name: 'g02',
            description: 'hi'
        });
        
        expect(result.name).toBe('g02');
        expect(mockSave).toHaveBeenCalled();
    });

   it("update gateway: conflict", async () => {
    const existingGateway = new GatewayDAO();
    existingGateway.macAddress = '14:14:14:14';
    existingGateway.name = 'g01';
    existingGateway.description = 'hi';
    existingGateway.networkId = 14;

    const conflictingGateway = new GatewayDAO();
    conflictingGateway.macAddress = '15:15:15:15';
    conflictingGateway.name = 'g02';
    conflictingGateway.description = 'hi';
    conflictingGateway.networkId = 14;

    // La prima chiamata a .find (in getGatewayByMac)
    mockFind.mockResolvedValueOnce([existingGateway]);

    // La seconda chiamata a .find (in throwConflictIfFound)
    mockFind.mockResolvedValueOnce([conflictingGateway]);

    await expect(repo.updateGateway('14:14:14:14', {
        macAddress: '15:15:15:15', 
        name: 'new name',
        description: 'new description'})).rejects.toThrow(ConflictError);
    });

    

    it("delete gateway", async() => {
        const gatewayToDelete = new GatewayDAO();
        gatewayToDelete.macAddress ='14:14:14:14';
        gatewayToDelete.name ='g02';
        gatewayToDelete.description ='hi';
        gatewayToDelete.networkId = 14;

        mockFind.mockResolvedValue([gatewayToDelete]);
        mockRemove.mockResolvedValue(undefined);

        await repo.deleteGateway('14:14:14:14');
        expect(mockRemove).toHaveBeenCalledWith(gatewayToDelete);
    });

    it("delete gateway: NotFoundError", async() => {
        mockFind.mockResolvedValue([]);

        await expect(repo.deleteGateway('14:14:14:14')).rejects.toThrow(NotFoundError);
    });

});