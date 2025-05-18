import { Measurements as MeasurementsDTO } from "@dto/Measurements";
import { MeasurementRepository } from "@repositories/MeasurementRepository";
import { mapToMeasurementsDTO, mapToStatsDTO } from "@services/mapperService";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { SensorRepository } from "@repositories/SensorRepository";
import { parseISODateParamToUTC } from "@utils";
import { MeasurementDAO } from "@models/dao/MeasurementDAO";
import { SensorDAO } from "@models/dao/SensorDAO";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { Stats as StatsDTO } from "@models/dto/Stats";
import { Measurement as MeasurementDTO } from "@models/dto/Measurement";

function computeMean(measurements: Array<MeasurementDAO>): number {
  if (measurements.length === 0) return 0;
  const somma = measurements.map(m => m.value).reduce((acc, val) => acc + val, 0);
  return somma / measurements.length;
}

function computeVariance(measurements: Array<MeasurementDAO>, mu: number): number {
  if (measurements.length < 2) return 0;
  const sommaQuadrati = measurements.map(m => m.value).reduce((acc, val) => acc + Math.pow(val - mu, 2), 0);
  return sommaQuadrati / (measurements.length);
}

function computeUpperThreshold(mean: number, variance: number): number {
  const dev = Math.sqrt(variance);
  return mean+2*dev;
} 

function computeLowerThreshold(mean: number, variance: number): number {
  const dev = Math.sqrt(variance);
  return mean-2*dev;
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
  const sensors = await verifySensors(networkCode, sensorMacs);
  if (sensors.length === 0) return [];

  const measurementRepo = new MeasurementRepository();
  const startDate_as_Date = startDate ? parseISODateParamToUTC(startDate) : undefined;
  const endDate_as_Date = endDate ? parseISODateParamToUTC(endDate) : undefined;

  const results: MeasurementsDTO[] = [];
  for (const sensor of sensors) {
    const measurements = await measurementRepo.getMeasurementsBySensorId(sensor.id, startDate_as_Date, endDate_as_Date);
    const mean = computeMean(measurements);
    const variance = computeVariance(measurements, mean);
    results.push(mapToMeasurementsDTO(sensor.macAddress, startDate_as_Date, endDate_as_Date, mean, variance, computeUpperThreshold(mean, variance), computeLowerThreshold(mean, variance), measurements));
  }
  return results;
}

export async function getStatsOfNetwork(networkCode: string, sensorMacs: Array<string>, startDate: string, endDate: string): Promise<StatsDTO> {
  const sensors = await verifySensors(networkCode, sensorMacs);
  if (sensors.length === 0) return mapToStatsDTO(undefined, undefined, 0, 0, 0, 0);

  const measurementRepo = new MeasurementRepository();
  const startDate_as_Date = startDate ? parseISODateParamToUTC(startDate) : undefined;
  const endDate_as_Date = endDate ? parseISODateParamToUTC(endDate) : undefined;

  let allMeasurements: MeasurementDAO[] = [];
  for (const sensor of sensors) {
    const measurements = await measurementRepo.getMeasurementsBySensorId(sensor.id, startDate_as_Date, endDate_as_Date);
    allMeasurements.push(...measurements);
  }

  const mean = computeMean(allMeasurements);
  const variance = computeVariance(allMeasurements, mean);
  return mapToStatsDTO(startDate_as_Date, endDate_as_Date, mean, variance, computeUpperThreshold(mean, variance), computeLowerThreshold(mean, variance));
}

export async function getOutliersMeasurementsOfNetwork(networkCode: string, sensorMacs: Array<string>, startDate: string, endDate: string): Promise<MeasurementsDTO[]> {
  const sensors = await verifySensors(networkCode, sensorMacs);
  if (sensors.length === 0) return [];

  const measurementRepo = new MeasurementRepository();
  const startDate_as_Date = startDate ? parseISODateParamToUTC(startDate) : undefined;
  const endDate_as_Date = endDate ? parseISODateParamToUTC(endDate) : undefined;

  const results: MeasurementsDTO[] = [];

  for (const sensor of sensors) {
    const measurements = await measurementRepo.getMeasurementsBySensorId(sensor.id, startDate_as_Date, endDate_as_Date);
    const mean = computeMean(measurements);
    const variance = computeVariance(measurements, mean);
    const upperThreshold = computeUpperThreshold(mean, variance);
    const lowerThreshold = computeLowerThreshold(mean, variance);
    const outliers = await measurementRepo.getOutliersMeasurementsBySensorId(sensor.id, startDate_as_Date, endDate_as_Date, upperThreshold, lowerThreshold);
    
    results.push(mapToMeasurementsDTO(sensor.macAddress, startDate_as_Date, endDate_as_Date, mean, variance, upperThreshold, lowerThreshold, outliers));
  }

  return results;
}


export async function getMeasurementsOfSensor(networkCode: string, gatewayMac: string, sensorMac: string, startDate: string, endDate: string): Promise<MeasurementsDTO> {
    const networkRepo = new NetworkRepository();
    await networkRepo.getNetworkByCode(networkCode);
    const gatewayRepo = new GatewayRepository();
    await gatewayRepo.getGatewayByMac(gatewayMac);
    const sensorRepo = new SensorRepository();
    const sensorId = (await sensorRepo.getSensorByMac(sensorMac)).id;

    const measurementRepo = new MeasurementRepository();
    const startDate_as_Date = startDate !== undefined ? parseISODateParamToUTC(startDate) : undefined;
    const endDate_as_Date = endDate !== undefined ? parseISODateParamToUTC(endDate) : undefined;
    const measurements: Array<MeasurementDAO> = await measurementRepo.getMeasurementsBySensorId(sensorId, startDate_as_Date, endDate_as_Date);
    const mean = computeMean(measurements);
    const variance = computeVariance(measurements, mean);

    return mapToMeasurementsDTO(sensorMac, startDate_as_Date, endDate_as_Date, mean, variance, computeUpperThreshold(mean, variance), computeLowerThreshold(mean, variance), measurements);
}

export async function getStatsOfSensor(networkCode: string, gatewayMac: string, sensorMac: string, startDate: string, endDate: string): Promise<StatsDTO> {
    const networkRepo = new NetworkRepository();
    await networkRepo.getNetworkByCode(networkCode);
    const gatewayRepo = new GatewayRepository();
    await gatewayRepo.getGatewayByMac(gatewayMac);
    const sensorRepo = new SensorRepository();
    const sensorId = (await sensorRepo.getSensorByMac(sensorMac)).id;

    const measurementRepo = new MeasurementRepository();
    const startDate_as_Date = startDate !== undefined ? parseISODateParamToUTC(startDate) : undefined;
    const endDate_as_Date = endDate !== undefined ? parseISODateParamToUTC(endDate) : undefined;
    const measurements: Array<MeasurementDAO> = await measurementRepo.getMeasurementsBySensorId(sensorId, startDate_as_Date, endDate_as_Date);
    const mean = computeMean(measurements);
    const variance = computeVariance(measurements, mean);
    
    return mapToStatsDTO(startDate_as_Date, endDate_as_Date, mean, variance, computeUpperThreshold(mean, variance), computeLowerThreshold(mean, variance));
}

export async function getOutliersMeasurementsOfSensor(networkCode: string, gatewayMac: string, sensorMac: string, startDate: string, endDate: string): Promise<MeasurementsDTO> {
    const networkRepo = new NetworkRepository();
    await networkRepo.getNetworkByCode(networkCode);
    const gatewayRepo = new GatewayRepository();
    await gatewayRepo.getGatewayByMac(gatewayMac);
    const sensorRepo = new SensorRepository();
    const sensorId = (await sensorRepo.getSensorByMac(sensorMac)).id;

    const measurementRepo = new MeasurementRepository();
    const startDate_as_Date = startDate !== undefined ? parseISODateParamToUTC(startDate) : undefined;
    const endDate_as_Date = endDate !== undefined ? parseISODateParamToUTC(endDate) : undefined;
    const measurements: Array<MeasurementDAO> = await measurementRepo.getMeasurementsBySensorId(sensorId, startDate_as_Date, endDate_as_Date );
    const mean = computeMean(measurements);
    const variance = computeVariance(measurements, mean);
    const upperThreshold = computeUpperThreshold(mean, variance);
    const lowerThreshold =  computeLowerThreshold(mean, variance)
    const outliers: Array<MeasurementDAO> = await measurementRepo.getOutliersMeasurementsBySensorId(sensorId, startDate_as_Date, endDate_as_Date, upperThreshold, lowerThreshold);

    return mapToMeasurementsDTO(sensorMac, startDate_as_Date, endDate_as_Date, mean, variance, upperThreshold, lowerThreshold, outliers);
}

export async function storeMeasurement(networkCode: string, gatewayMac: string, sensorMac: string, measurements: MeasurementDTO[]): Promise<void> {
    const networkRepo = new NetworkRepository();
    await networkRepo.getNetworkByCode(networkCode);
    const gatewayRepo = new GatewayRepository();
    await gatewayRepo.getGatewayByMac(gatewayMac);
    const sensorRepo = new SensorRepository();
    const sensorId = (await sensorRepo.getSensorByMac(sensorMac)).id;

    const measurementRepo = new MeasurementRepository();

    for (let m of measurements) {
      await measurementRepo.storeMeasurement(m.createdAt, m.value, sensorId);
    }
}