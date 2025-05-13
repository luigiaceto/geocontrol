import { Measurements as MeasurementsDTO } from "@dto/Measurements";
import { MeasurementRepository } from "@repositories/MeasurementRepository";
import { mapNetworkDAOToDTO, mapToMeasurementsDTO, mapToStatsDTO } from "@services/mapperService";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { SensorRepository } from "@repositories/SensorRepository";
import { parseISODateParamToUTC } from "@utils";
import { MeasurementDAO } from "@models/dao/MeasurementDAO";
import { SensorDAO } from "@models/dao/SensorDAO";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { Stats as StatsDTO } from "@models/dto/Stats";

function computeMean(measurements: Array<MeasurementDAO>): number {
  if (measurements.length === 0) return undefined;
  const somma = measurements.map(m => m.value).reduce((acc, val) => acc + val, 0);
  return somma / measurements.length;
}

function computeVariance(measurements: Array<MeasurementDAO>, mu: number): number {
  if (measurements.length === 0) return undefined;
  if (measurements.length < 2) return 0;
  const sommaQuadrati = measurements.map(m => m.value).reduce((acc, val) => acc + Math.pow(val - mu, 2), 0);
  return sommaQuadrati / (measurements.length);
}

function computeUpperThreshold(mean: number, variance: number): number {
  if (mean === undefined || variance === undefined) return undefined;
  return mean+2*variance;
} 

function computeLowerThreshold(mean: number, variance: number): number {
  if (mean === undefined || variance === undefined) return undefined;
  return mean-2*variance;
}

// - se è stato passato un array di sensorMac, ritorna i sensori che appartengono 
//   effettivamente al network
// - se non è stato passato un array di sensorMac, ritorna tutti i sensori del
//   network
async function verifySensors(code: string, sensorMacs: Array<string>): Promise<SensorDAO[]> {
  const networkRepo = new NetworkRepository();
  const network = await networkRepo.getNetworkByCode(code);
  const networkGateways = network.gateways;
  const sensorRepo = new SensorRepository();
  let validSensors = []

  if (sensorMacs === undefined) {
    let sensor = null;
    for (let sensorMac in sensorMacs) {
        sensor = await sensorRepo.getSensorByMac(sensorMac);
        if (networkGateways.includes(sensor.gateway)) {
            validSensors.push(sensor);
        }
    }
  } else {
    validSensors = networkGateways.map(gw => gw.sensors).flat();
  }
  return validSensors;
}

export async function getMeasurementsOfNetwork(networkCode: string, sensorMacs: Array<string>, startDate: string, endDate: string): Promise<MeasurementsDTO[]> {
  let sensorsId = await verifySensors(networkCode, sensorMacs);

  if (sensorsId.length === 0) {
    return [];
  }

  const measurementRepo = new MeasurementRepository();

  // DA COMPLETARE

  return ;
}

export async function getMeasurementsOfSensor(networkCode: string, gatewayMac: string, sensorMac: string, startDate: string, endDate: string): Promise<MeasurementsDTO> {
    const netoworkRepo = new NetworkRepository();
    await netoworkRepo.getNetworkByCode(networkCode);
    const gatewayRepo = new GatewayRepository();
    await gatewayRepo.getGatewayByMac(gatewayMac);
    const sensorRepo = new SensorRepository();
    const sensorId = (await sensorRepo.getSensorByMac(sensorMac)).id;

    const measurementRepo = new MeasurementRepository();
    const measurements: Array<MeasurementDAO> = await measurementRepo.getMeasurementsBySensorId(
        sensorId, 
        startDate !== undefined ? parseISODateParamToUTC(startDate) : undefined, 
        endDate !== undefined ? parseISODateParamToUTC(endDate) : undefined);
    const mean = computeMean(measurements);
    const variance = computeVariance(measurements, mean);
    return mapToMeasurementsDTO(sensorMac, startDate, endDate, mean, variance, computeLowerThreshold(mean, variance), computeLowerThreshold(mean, variance), measurements);
}

export async function getStatsOfSensor(networkCode: string, gatewayMac: string, sensorMac: string, startDate: string, endDate: string): Promise<StatsDTO> {
    const netoworkRepo = new NetworkRepository();
    await netoworkRepo.getNetworkByCode(networkCode);
    const gatewayRepo = new GatewayRepository();
    await gatewayRepo.getGatewayByMac(gatewayMac);
    const sensorRepo = new SensorRepository();
    const sensorId = (await sensorRepo.getSensorByMac(sensorMac)).id;

    const measurementRepo = new MeasurementRepository();
    const measurements: Array<MeasurementDAO> = await measurementRepo.getMeasurementsBySensorId(
        sensorId, 
        startDate !== undefined ? parseISODateParamToUTC(startDate) : undefined, 
        endDate !== undefined ? parseISODateParamToUTC(endDate) : undefined);
    const mean = computeMean(measurements);
    const variance = computeVariance(measurements, mean);
    // NEL CASO DI NESSUN MEASUREMENTS ???
    return mapToStatsDTO(startDate, endDate, mean, variance, computeUpperThreshold(mean, variance), computeLowerThreshold(mean, variance));
}
