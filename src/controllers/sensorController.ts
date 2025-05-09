import { Sensor as SensorDTO } from "@dto/Sensor";
import { SensorRepository } from "@repositories/SensorRepository";
import { mapSensorDAOToDTO } from "@services/mapperService";

export async function getSensorsByGateway(networkCode:string, gatewayMac: string): Promise<SensorDTO[]> {
  /* Per verificare che il gateway/network esista e nel caso lanciare errore
  const gatewayRepo = new GatewayRepository();
  await gatewayRepo.getGatewayByMac(gatewayMac);
  const netoworkRepo = new NetworkRepository();
  await netowrkRepo.getNetworkByCode(netowrkCode);
  */
  const sensorRepo = new SensorRepository();
  return (await sensorRepo.getSensorsByGateway(gatewayMac)).map(mapSensorDAOToDTO);
}

export async function createSensor(networkCode:string, gatewayMac: string, sensorDto: SensorDTO): Promise<void> {
  /* Per verificare che il gateway/network esista e nel caso lanciare errore
  const gatewayRepo = new GatewayRepository();
  await gatewayRepo.getGatewayByMac(gatewayMac);
  const netoworkRepo = new NetworkRepository();
  await netowrkRepo.getNetworkByCode(netowrkCode);
  */
  const sensorRepo = new SensorRepository();
  await sensorRepo.createSensor(sensorDto.macAddress, sensorDto.name, sensorDto.description, sensorDto.variable, sensorDto.unit, gatewayMac);
}

export async function getSensorByMac(networkCode:string, gatewayMac: string, sensorMac: string): Promise<SensorDTO> {
  /* Per verificare che il gateway/network esista e nel caso lanciare errore
  const gatewayRepo = new GatewayRepository();
  await gatewayRepo.getGatewayByMac(gatewayMac);
  const netoworkRepo = new NetworkRepository();
  await netowrkRepo.getNetworkByCode(netowrkCode);
  */
  const sensorRepo = new SensorRepository();
  return mapSensorDAOToDTO(await sensorRepo.getSensorByMac(sensorMac));
}

export async function updateSensor(networkCode:string, gatewayMac: string, sensorMac: string, sensorDTO: SensorDTO): Promise<void> {
  /* Per verificare che il gateway/network esista e nel caso lanciare errore
  const gatewayRepo = new GatewayRepository();
  await gatewayRepo.getGatewayByMac(gatewayMac);
  const netoworkRepo = new NetworkRepository();
  await netowrkRepo.getNetworkByCode(netowrkCode);
  */
  const sensorRepo = new SensorRepository();
  await sensorRepo.updateSensor(sensorMac, sensorDTO);
}

export async function deleteSensor(networkCode:string, gatewayMac: string, sensorMac: string): Promise<void> {
  /* Per verificare che il gateway/network esista e nel caso lanciare errore
  const gatewayRepo = new GatewayRepository();
  await gatewayRepo.getGatewayByMac(gatewayMac);
  const netoworkRepo = new NetworkRepository();
  await netowrkRepo.getNetworkByCode(netowrkCode);
  */
  const sensorRepo = new SensorRepository();
  await sensorRepo.deleteSensor(sensorMac);
}