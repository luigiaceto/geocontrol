import { NotFoundError } from "@errors/NotFoundError";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { SensorRepository } from "@repositories/SensorRepository";

export async function verifyChainToGateway(networkCode: string, gatewayMac: string): Promise<GatewayRepository> {
  const networkRepo = new NetworkRepository();
  const network = await networkRepo.getNetworkByCode(networkCode);
  const gatewayRepo = new GatewayRepository();
  const gateway = await gatewayRepo.getGatewayByMac(gatewayMac);
  if (!network.gateways.map(gw => gw.macAddress).includes(gateway.macAddress)) {
    throw new NotFoundError("Gateway not found in the specified network");
  }
  return gatewayRepo;
}

export async function verifyChainToSensor(networkCode: string, gatewayMac: string, sensorMac: string): Promise<SensorRepository> {
  const networkRepo = new NetworkRepository();
  const network = await networkRepo.getNetworkByCode(networkCode);
  const gatewayRepo = new GatewayRepository();
  const gateway = await gatewayRepo.getGatewayByMac(gatewayMac);
  const sensorRepo = new SensorRepository();
  const sensor = await sensorRepo.getSensorByMac(sensorMac);
  if (!network.gateways.map(gw => gw.macAddress).includes(gateway.macAddress)) {
    throw new NotFoundError("Gateway not found in the specified network");
  }
  if (!gateway.sensors.map(s => s.macAddress).includes(sensor.macAddress)) {
    throw new NotFoundError("Sensor not found in the specified gateway");
  }
    
  return sensorRepo;
}
