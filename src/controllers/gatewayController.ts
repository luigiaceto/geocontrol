import { Gateway as GatewayDTO } from "@dto/Gateway";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { mapGatewayDAOToDTO } from "@services/mapperService";

export async function getAllGateways(networkCode: string): Promise<GatewayDTO[]> {
  const gatewayRepo = new GatewayRepository();
  return (await gatewayRepo.getGatewaysByNetworkCode(networkCode)).map(mapGatewayDAOToDTO);
}

export async function getGateway(networkCode: string, macAddress: string): Promise<GatewayDTO> {
  const gatewayRepo = new GatewayRepository();
  return mapGatewayDAOToDTO(await gatewayRepo.getGatewayByMac(macAddress));
}

export async function createGateway(networkCode: string, gatewayDto: GatewayDTO): Promise<void> {
  const gatewayRepo = new GatewayRepository();
  await gatewayRepo.createGateway(gatewayDto.macAddress, gatewayDto.name, gatewayDto.description, networkCode);
}

export async function updateGateway(networkCode: string, macAddress: string, gatewayDto: GatewayDTO): Promise<void> {
  const gatewayRepo = new GatewayRepository();
  await gatewayRepo.updateGateway(macAddress, gatewayDto);
}

export async function deleteGateway(networkCode: string, macAddress: string): Promise<void> {
  const gatewayRepo = new GatewayRepository();
  await gatewayRepo.deleteGateway(macAddress);
}
