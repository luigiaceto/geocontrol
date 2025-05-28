import { Sensor as SensorDTO } from "@dto/Sensor";
import { ConflictError } from "@models/errors/ConflictError";
import { SensorRepository } from "@repositories/SensorRepository";
import { mapSensorDAOToDTO } from "@services/mapperService";
import { verifyChainToGateway, verifyChainToSensor } from "@services/verifyService";

export async function getSensorsByGateway(networkCode:string, gatewayMac: string): Promise<SensorDTO[]> {
  const gatewayRepo = await verifyChainToGateway(networkCode, gatewayMac);
  const gatewayId = (await gatewayRepo.getGatewayByMac(gatewayMac)).id;
  const sensorRepo = new SensorRepository();
  return (await sensorRepo.getSensorsByGatewayId(gatewayId)).map(mapSensorDAOToDTO);
}

export async function createSensor(networkCode: string, gatewayMac: string, sensorDto: SensorDTO): Promise<void> {
  const gatewayRepo = await verifyChainToGateway(networkCode, gatewayMac);
  const gatewayId = (await gatewayRepo.getGatewayByMac(gatewayMac)).id;
  let throwFlag = 0;
  try{
    if( await gatewayRepo.getGatewayByMac(sensorDto.macAddress)){
      throwFlag = 1;
    }
  } catch (error) {
    if ( throwFlag === 1) {
      throw new ConflictError("Gateway with the same MAC address already exists");
    }
  }
  const sensorRepo = new SensorRepository();
  const existingSensor = await sensorRepo.getSensorByMac(sensorDto.macAddress);
  if (existingSensor) {
    throw new ConflictError("Sensor with the same MAC address already exists");
  }

  await sensorRepo.createSensor(
    sensorDto.macAddress,
    sensorDto.name,
    sensorDto.description,
    sensorDto.variable,
    sensorDto.unit,
    gatewayId
  );
}

export async function getSensorByMac(networkCode:string, gatewayMac: string, sensorMac: string): Promise<SensorDTO> {
  const sensorRepo = await verifyChainToSensor(networkCode, gatewayMac, sensorMac);
  return mapSensorDAOToDTO(await sensorRepo.getSensorByMac(sensorMac));
}

export async function updateSensor(networkCode: string, gatewayMac: string, sensorMac: string, sensorDTO: SensorDTO): Promise<void> {
  const gatewayRepo = await verifyChainToGateway(networkCode, gatewayMac);
  let throwFlag = 0;
  try {
    if (sensorDTO.macAddress && await gatewayRepo.getGatewayByMac(sensorDTO.macAddress)) 
      throwFlag = 1;
  } catch (error) {
    if (throwFlag === 1) {
      throw new ConflictError("Gateway with the same MAC address already exists");
    }
  }
  const sensorRepo = await verifyChainToSensor(networkCode, gatewayMac, sensorMac);

  await sensorRepo.updateSensor(
    sensorMac,
    sensorDTO
  );
}


export async function deleteSensor(networkCode:string, gatewayMac: string, sensorMac: string): Promise<void> {
  const sensorRepo = await verifyChainToSensor(networkCode, gatewayMac, sensorMac);
  await sensorRepo.deleteSensor(sensorMac);
}