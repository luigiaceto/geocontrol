import { Gateway as GatewayDTO } from "@dto/Gateway";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { mapGatewayDAOToDTO } from "@services/mapperService";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { verifyChainToGateway } from "@services/verifyService";
import { SensorRepository } from "@repositories/SensorRepository";
import { ConflictError } from "@models/errors/ConflictError";

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
  const sensorRepo = new SensorRepository();
  let throwFlag = 0;
  try {
    // se viene trovato un sensore con lo stesso MAC del gateway che vogliamo creare
    if (await sensorRepo.getSensorByMac(gatewayDto.macAddress)) {
      throwFlag = 1;   
    }
  } catch (error) {}
  if (throwFlag === 1) {
    throw new ConflictError("Sensor with the same MAC address already exists");
  }
  await gatewayRepo.createGateway(gatewayDto.macAddress, gatewayDto.name, gatewayDto.description, networkId); 
}

export async function updateGateway(networkCode: string, gatewayMac: string, gatewayDTO: GatewayDTO): Promise<void> {
  const gatewayRepo = await verifyChainToGateway(networkCode, gatewayMac);
  const sensorRepo = new SensorRepository();
  let throwFlag = 0;
  try {
    // se vogliamo modificare il MAC del gateway ma questo è giò associato ad un sensore
    if (gatewayDTO.macAddress && await sensorRepo.getSensorByMac(gatewayDTO.macAddress)) {
      throwFlag = 1;
    }
  } catch (error) {}
  if (throwFlag === 1) {
    throw new ConflictError("Sensor with the same MAC address already exists");
  }
  await gatewayRepo.updateGateway(gatewayMac, gatewayDTO);
}

export async function deleteGateway(networkCode: string, gatewayMac: string): Promise<void> {
  const gatewayRepo = await verifyChainToGateway(networkCode, gatewayMac);
  await gatewayRepo.deleteGateway(gatewayMac);
}
