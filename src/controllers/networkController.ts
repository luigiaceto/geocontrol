import { Network as NetworkDTO } from "@dto/Network";
import { NotFoundError } from "@models/errors/NotFoundError";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { mapNetworkDAOToDTO } from "@services/mapperService";

export async function getAllNetworks(): Promise<NetworkDTO[]> {
  const networkRepo = new NetworkRepository();
  return (await networkRepo.getAllNetworks()).map(mapNetworkDAOToDTO);
}

export async function getNetwork(code: string) {
  const networkRepo = new NetworkRepository();
  const network = await networkRepo.getNetworkByCode(code);

  if (!network) {
    throw new NotFoundError(`Network with code '${code}' not found`);
  }

  return mapNetworkDAOToDTO(network);
}

export async function createNetwork(networkDto: NetworkDTO): Promise<void> {
  const networkRepo = new NetworkRepository();
  await networkRepo.createNetwork(networkDto.code, networkDto.name, networkDto.description);
}

export async function updateNetwork(code: string, networkDto: NetworkDTO): Promise<void> {
  const networkRepo = new NetworkRepository();
  await networkRepo.updateNetwork(code, networkDto);
}

export async function deleteNetwork(code: string): Promise<void> {
  const networkRepo = new NetworkRepository();
  await networkRepo.deleteNetwork(code);
}
