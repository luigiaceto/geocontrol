import { Gateway as GatewayDTO } from "@dto/Gateway";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { mapGatewayDAOToDTO } from "@services/mapperService";
import { NetworkRepository } from "@repositories/NetworkRepository";

export async function getAllGateways(networkCode: string): Promise<GatewayDTO[]> {
  const networkRepo = new NetworkRepository();
  const networkId = (await networkRepo.getNetworkByCode(networkCode)).id
  const gatewayRepo = new GatewayRepository();
  return (await gatewayRepo.getGatewaysByNetworkId(networkId)).map(mapGatewayDAOToDTO);
}

export async function getGateway(networkCode: string, macAddress: string): Promise<GatewayDTO> {
  const networkRepo = new NetworkRepository();
  await networkRepo.getNetworkByCode(networkCode);
  const gatewayRepo = new GatewayRepository();
  return mapGatewayDAOToDTO(await gatewayRepo.getGatewayByMac(macAddress));
}

export async function createGateway(networkCode: string, gatewayDto: GatewayDTO): Promise<void> {
  const networkRepo = new NetworkRepository();
  const networkId = (await networkRepo.getNetworkByCode(networkCode)).id;
  const gatewayRepo = new GatewayRepository();
  await gatewayRepo.createGateway(gatewayDto.macAddress, gatewayDto.name, gatewayDto.description, networkId);
}

export async function updateGateway(networkCode: string, macAddress: string, gatewayDTO: GatewayDTO): Promise<void> {
  const networkRepo = new NetworkRepository();
  await networkRepo.getNetworkByCode(networkCode);
  const gatewayRepo = new GatewayRepository();
  await gatewayRepo.updateGateway(macAddress, gatewayDTO);
}

export async function deleteGateway(networkCode: string, macAddress: string): Promise<void> {
  const networkRepo = new NetworkRepository();
  await networkRepo.getNetworkByCode(networkCode);
  const gatewayRepo = new GatewayRepository();
  await gatewayRepo.deleteGateway(macAddress);
}
