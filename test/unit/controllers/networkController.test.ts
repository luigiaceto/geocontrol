import * as networkController from "@controllers/networkController";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { NetworkDAO } from "@dao/NetworkDAO";
import { NotFoundError } from "@models/errors/NotFoundError";

jest.mock("@repositories/NetworkRepository");

describe("networkController unit tests", () => {
  it("getNetwork: returns mapped DTO", async () => {
    const code = "net01";

    const fakeNetwork = new NetworkDAO();
    fakeNetwork.code = code;
    fakeNetwork.name = "Network 01";
    fakeNetwork.description = "Test network";
    fakeNetwork.gateways = []; // Necessario per evitare errori nel mapper

    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getNetworkByCode: jest.fn().mockResolvedValue(fakeNetwork)
    }));

    const result = await networkController.getNetwork(code);

    expect(result).toEqual({
      code: fakeNetwork.code,
      name: fakeNetwork.name,
      description: fakeNetwork.description
      // gateways NON incluso se il DTO finale non lo prevede
    });
  });

  it("getAllNetworks: returns list of mapped DTOs", async () => {
    const fakeNetwork1 = new NetworkDAO();
    fakeNetwork1.code = "net01";
    fakeNetwork1.name = "Network 01";
    fakeNetwork1.description = "First network";
    fakeNetwork1.gateways = [];

    const fakeNetwork2 = new NetworkDAO();
    fakeNetwork2.code = "net02";
    fakeNetwork2.name = "Network 02";
    fakeNetwork2.description = "Second network";
    fakeNetwork2.gateways = [];

    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getAllNetworks: jest.fn().mockResolvedValue([fakeNetwork1, fakeNetwork2])
    }));

    const result = await networkController.getAllNetworks();

    expect(result).toEqual([
      {
        code: fakeNetwork1.code,
        name: fakeNetwork1.name,
        description: fakeNetwork1.description
      },
      {
        code: fakeNetwork2.code,
        name: fakeNetwork2.name,
        description: fakeNetwork2.description
      }
    ]);
  });

  it("getNetworkByCode: throws NotFoundError if not found", async () => {
    const code = "missing-code";

    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getNetworkByCode: jest.fn().mockResolvedValue(undefined)
    }));

    await expect(networkController.getNetwork(code)).rejects.toThrow(NotFoundError);
  });
});
