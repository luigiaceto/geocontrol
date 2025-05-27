import { NetworkRepository } from "@repositories/NetworkRepository";
import { NetworkDAO } from "@dao/NetworkDAO";
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

describe("Network Repository: mocked database", () => {
  const repo = new NetworkRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create network", async () => {
    mockFind.mockResolvedValue([]);
    const savedNetwork = new NetworkDAO();
    savedNetwork.code = "n001";
    savedNetwork.name = "Net 1";
    savedNetwork.description = "desc";

    mockSave.mockResolvedValue(savedNetwork);

    const result = await repo.createNetwork("n001", "Net 1", "desc");

    expect(result).toBeInstanceOf(NetworkDAO);
    expect(result).toMatchObject({
      code: "n001",
      name: "Net 1",
      description: "desc"
    });
    expect(mockSave).toHaveBeenCalledWith({
      code: "n001",
      name: "Net 1",
      description: "desc"
    });
  });

  it("create network: conflict", async () => {
    const existingNetwork = new NetworkDAO();
    existingNetwork.code = "n001";
    existingNetwork.name = "Net 1";
    existingNetwork.description = "desc";

    mockFind.mockResolvedValue([existingNetwork]);

    await expect(repo.createNetwork("n001", "Other", "desc")).rejects.toThrow(ConflictError);
  });

  it("create network with undefined optional fields", async () => {
    mockFind.mockResolvedValue([]); // Nessun conflitto esistente

    const savedNetwork = new NetworkDAO();
    savedNetwork.code = "n003";
    savedNetwork.name = null;
    savedNetwork.description = null;

    mockSave.mockResolvedValue(savedNetwork);

    const result = await repo.createNetwork("n003", undefined, undefined);

    expect(result).toBeInstanceOf(NetworkDAO);
    expect(result).toMatchObject({
      code: "n003",
      name: null,
      description: null
    });

    expect(mockSave).toHaveBeenCalledWith({
      code: "n003",
      name: null,
      description: null
    });
  });


  it("get network by code", async () => {
    const foundNetwork = new NetworkDAO();
    foundNetwork.code = "n001";
    foundNetwork.name = "Net 1";
    foundNetwork.description = "desc";

    mockFind.mockResolvedValue([foundNetwork]);

    const result = await repo.getNetworkByCode("n001");
    expect(result).toBe(foundNetwork);
    expect(result.code).toBe("n001");
  });

  it("get network by code: NotFoundError", async () => {
    mockFind.mockResolvedValue([]);
    await expect(repo.getNetworkByCode("n001")).rejects.toThrow(NotFoundError);
  });

  it("get all networks", async () => {
    const net1 = new NetworkDAO();
    net1.code = "n001";
    net1.name = "Net 1";
    net1.description = "desc";

    const net2 = new NetworkDAO();
    net2.code = "n002";
    net2.name = "Net 2";
    net2.description = "desc";

    mockFind.mockResolvedValue([net1, net2]);

    const result = await repo.getAllNetworks();
    expect(result).toHaveLength(2);
    expect(result).toContainEqual(net1);
    expect(result).toContainEqual(net2);
  });

  it("update network: code", async () => {
    const existingNetwork = new NetworkDAO();
    existingNetwork.code = "n001";
    existingNetwork.name = "Net 1";
    existingNetwork.description = "desc";

    mockFind.mockResolvedValueOnce([existingNetwork]);
    mockFind.mockResolvedValueOnce([]);

    const updatedNetwork = new NetworkDAO();
    updatedNetwork.code = "n002";
    updatedNetwork.name = "Net 1";
    updatedNetwork.description = "desc";

    mockSave.mockResolvedValue(updatedNetwork);

    const result = await repo.updateNetwork("n001", {
      code: "n002",
      name: "Net 1",
      description: "desc"
    });

    expect(result.code).toBe("n002");
    expect(mockSave).toHaveBeenCalled();
  });

  it("update network: NotNetworkCode", async () => {
    const existingNetwork = new NetworkDAO();
    existingNetwork.code = "n001";
    existingNetwork.name = "Net 1";
    existingNetwork.description = "desc";

    mockFind.mockResolvedValue([existingNetwork]);

    const updatedNetwork = new NetworkDAO();
    updatedNetwork.code = "n001";
    updatedNetwork.name = "Updated";
    updatedNetwork.description = "desc";

    mockSave.mockResolvedValueOnce(updatedNetwork);

    const result = await repo.updateNetwork("n001", {
      code: "n001",
      name: "Updated",
      description: "desc"
    });

    expect(result.name).toBe("Updated");
    expect(mockSave).toHaveBeenCalled();
  });

  it("update network: conflict", async () => {
    const existingNetwork = new NetworkDAO();
    existingNetwork.code = "n001";
    existingNetwork.name = "Net 1";
    existingNetwork.description = "desc";

    const conflictingNetwork = new NetworkDAO();
    conflictingNetwork.code = "n002";
    conflictingNetwork.name = "Net 2";
    conflictingNetwork.description = "desc";

    mockFind.mockResolvedValueOnce([existingNetwork]);

    mockFind.mockResolvedValueOnce([conflictingNetwork]);

    await expect(repo.updateNetwork("n001", {
      code: "n002",
      name: "new name",
      description: "new description"
    })).rejects.toThrow(ConflictError);
  });

  it("delete network", async () => {
    const networkToDelete = new NetworkDAO();
    networkToDelete.code = "n001";
    networkToDelete.name = "Net 1";
    networkToDelete.description = "desc";

    mockFind.mockResolvedValue([networkToDelete]);
    mockRemove.mockResolvedValue(undefined);

    await repo.deleteNetwork("n001");
    expect(mockRemove).toHaveBeenCalledWith(networkToDelete);
  });
});