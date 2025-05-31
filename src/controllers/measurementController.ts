import { Measurements as MeasurementsDTO } from "@dto/Measurements";
import { MeasurementRepository } from "@repositories/MeasurementRepository";
import { mapToMeasurementsDTO, mapToMeasurementsDTOOutliers, mapToStatsDTO, maptToStatisticsDTOForNetwork } from "@services/mapperService";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { SensorRepository } from "@repositories/SensorRepository";
import { parseISODateParamToUTC } from "@utils";
import { MeasurementDAO } from "@models/dao/MeasurementDAO";
import { SensorDAO } from "@models/dao/SensorDAO";
import { Stats as StatsDTO } from "@models/dto/Stats";
import { Measurement as MeasurementDTO } from "@models/dto/Measurement";
import { verifyChainToSensor } from "@services/verifyService";

function computeMean(measurements: Array<MeasurementDAO>): number {
  if (measurements.length === 0) return 0;
  const somma = measurements.map(m => m.value).reduce((acc, val) => acc + val, 0);
  return parseFloat((somma / measurements.length).toFixed(2));
}

function computeVariance(measurements: Array<MeasurementDAO>, mu: number): number {
  if (measurements.length < 2) return 0;
  const sommaQuadrati = measurements.map(m => m.value).reduce((acc, val) => acc + Math.pow(val - mu, 2), 0);
  return parseFloat((sommaQuadrati / (measurements.length)).toFixed(2));
}

function computeUpperThreshold(mean: number, variance: number): number {
  const dev = Math.sqrt(variance);
  return parseFloat((mean+2*dev).toFixed(2));
} 

function computeLowerThreshold(mean: number, variance: number): number {
  const dev = Math.sqrt(variance);
  return parseFloat((mean-2*dev).toFixed(2));
}

// - se è stato passato un array di sensorMac, ritorna i sensori, tra quelli 
//   nell'array, che appartengono effettivamente al network
// - se non è stato passato un array di sensorMac o questo è vuoto, ritorna tutti i sensori del
//   network (considerando tutti i gateways)
async function verifySensors(code: string, sensorMacs?: Array<string>): Promise<SensorDAO[]> {
  const networkRepo = new NetworkRepository();
  const network = await networkRepo.getNetworkByCode(code);
  const networkGateways = network.gateways;
  const sensorRepo = new SensorRepository();

  // tutti i sensori di tutti i gateway
  const networkSensors = networkGateways.flatMap(gw => gw.sensors);

  // se non è stato passato nessun array di sensori
  if (!sensorMacs || sensorMacs.length === 0) {
    return networkSensors;
  }

  // rimuovo eventuali sensori duplicati 
  const uniqueSensorMacs = Array.from(new Set(sensorMacs));

  const validSensors = [];
  for (let mac of uniqueSensorMacs) {
    let sensor: SensorDAO = null;
    try {
      sensor = await sensorRepo.getSensorByMac(mac);
    } catch (err) {
      // se il sensore non esiste, si passa semplicemente al prossimo
    }
    if (sensor && networkSensors.some(s => s.id === sensor.id)) {
      validSensors.push(sensor);
    }
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
  for (let sensor of sensors) {
    const measurements = await measurementRepo.getMeasurementsBySensorId(sensor.id, startDate_as_Date, endDate_as_Date);
    const mean = computeMean(measurements);
    const variance = computeVariance(measurements, mean);
    results.push(mapToMeasurementsDTO(sensor.macAddress, startDate_as_Date, endDate_as_Date, mean, variance, computeUpperThreshold(mean, variance), computeLowerThreshold(mean, variance), measurements));
  }
  return results;
}

// La risposta è un array i cui elementi sono formati da sensorMac + stats, dato che non 
// non esiste un DTO con SOLO questi campi si utilizza MeasurementsDTO con il campo measurements
// settato undefined
export async function getStatsOfNetwork(networkCode: string, sensorMacs: Array<string>, startDate: string, endDate: string): Promise<MeasurementsDTO[]> {
  const sensors = await verifySensors(networkCode, sensorMacs);
  if (sensors.length === 0) return [];

  const measurementRepo = new MeasurementRepository();
  const startDate_as_Date = startDate ? parseISODateParamToUTC(startDate) : undefined;
  const endDate_as_Date = endDate ? parseISODateParamToUTC(endDate) : undefined;

  const results: MeasurementsDTO[] = [];
  for (let sensor of sensors) {
    const measurements = await measurementRepo.getMeasurementsBySensorId(sensor.id, startDate_as_Date, endDate_as_Date);
    const mean = computeMean(measurements);
    const variance = computeVariance(measurements, mean);
    results.push(maptToStatisticsDTOForNetwork(sensor.macAddress, startDate_as_Date, endDate_as_Date, mean, variance, computeUpperThreshold(mean, variance), computeLowerThreshold(mean, variance), measurements));
  }
  return results;
}

export async function getOutliersMeasurementsOfNetwork(networkCode: string, sensorMacs: Array<string>, startDate: string, endDate: string): Promise<MeasurementsDTO[]> {
  const sensors = await verifySensors(networkCode, sensorMacs);
  if (sensors.length === 0) return [];

  const measurementRepo = new MeasurementRepository();
  const startDate_as_Date = startDate ? parseISODateParamToUTC(startDate) : undefined;
  const endDate_as_Date = endDate ? parseISODateParamToUTC(endDate) : undefined;

  const results: MeasurementsDTO[] = [];
  for (let sensor of sensors) {
    const measurements = await measurementRepo.getMeasurementsBySensorId(sensor.id, startDate_as_Date, endDate_as_Date);
    const mean = computeMean(measurements);
    const variance = computeVariance(measurements, mean);
    const upperThreshold = computeUpperThreshold(mean, variance);
    const lowerThreshold = computeLowerThreshold(mean, variance); 
    
    results.push(mapToMeasurementsDTOOutliers(sensor.macAddress, startDate_as_Date, endDate_as_Date, mean, variance, upperThreshold, lowerThreshold, measurements));
  }

  return results;
}

export async function getMeasurementsOfSensor(networkCode: string, gatewayMac: string, sensorMac: string, startDate: string, endDate: string): Promise<MeasurementsDTO> {
    const sensorRepo = await verifyChainToSensor(networkCode, gatewayMac, sensorMac);

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
    const sensorRepo = await verifyChainToSensor(networkCode, gatewayMac, sensorMac);

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
    const sensorRepo = await verifyChainToSensor(networkCode, gatewayMac, sensorMac);

    const sensorId = (await sensorRepo.getSensorByMac(sensorMac)).id;
    const measurementRepo = new MeasurementRepository();
    const startDate_as_Date = startDate !== undefined ? parseISODateParamToUTC(startDate) : undefined;
    const endDate_as_Date = endDate !== undefined ? parseISODateParamToUTC(endDate) : undefined;
    const measurements: Array<MeasurementDAO> = await measurementRepo.getMeasurementsBySensorId(sensorId, startDate_as_Date, endDate_as_Date );
    const mean = computeMean(measurements);
    const variance = computeVariance(measurements, mean);
    const upperThreshold = computeUpperThreshold(mean, variance);
    const lowerThreshold = computeLowerThreshold(mean, variance); 

    return mapToMeasurementsDTOOutliers(sensorMac, startDate_as_Date, endDate_as_Date, mean, variance, upperThreshold, lowerThreshold, measurements);
}

export async function storeMeasurements(networkCode: string, gatewayMac: string, sensorMac: string, measurements: MeasurementDTO[]): Promise<void> {
    const sensorRepo = await verifyChainToSensor(networkCode, gatewayMac, sensorMac);
    
    const sensorId = (await sensorRepo.getSensorByMac(sensorMac)).id;
    const measurementRepo = new MeasurementRepository();

    for (let m of measurements) {
      await measurementRepo.storeMeasurement(m.createdAt, m.value, sensorId);
    }
}