import { Gateway as GatewayDTO } from "@dto/Gateway";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { mapGatewayDAOToDTO } from "@services/mapperService";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { verifyChainToGateway } from "@services/verifyService";

export async function getAllGateways(networkCode: string): Promise<GatewayDTO[]> {
  const networkRepo = new NetworkRepository();
  const networkId = (await networkRepo.getNetworkByCode(networkCode)).id
  const gatewayRepo = new GatewayRepository();
  return (await gatewayRepo.getGatewaysByNetworkId(networkId)).map(mapGatewayDAOToDTO);
}

export async function getGateway(networkCode: string, gatewayMac: string): Promise<GatewayDTO> {
  const gatewayRepo = await verifyChainToGateway(networkCode, gatewayMac);
  return mapGatewayDAOToDTO(await gatewayRepo.getGatewayByMac(gatewayMac));
}

export async function createGateway(networkCode: string, gatewayDto: GatewayDTO): Promise<void> {
  const networkRepo = new NetworkRepository();
  const networkId = (await networkRepo.getNetworkByCode(networkCode)).id;
  const gatewayRepo = new GatewayRepository();
  await gatewayRepo.createGateway(gatewayDto.macAddress, gatewayDto.name, gatewayDto.description, networkId);
}

export async function updateGateway(networkCode: string, gatewayMac: string, gatewayDTO: GatewayDTO): Promise<void> {
  const gatewayRepo = await verifyChainToGateway(networkCode, gatewayMac);
  await gatewayRepo.updateGateway(gatewayMac, gatewayDTO);
}

export async function deleteGateway(networkCode: string, gatewayMac: string): Promise<void> {
  const gatewayRepo = await verifyChainToGateway(networkCode, gatewayMac);
  await gatewayRepo.deleteGateway(gatewayMac);
}
