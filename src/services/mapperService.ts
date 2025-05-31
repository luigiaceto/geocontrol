import { Token as TokenDTO } from "@dto/Token";
import { User as UserDTO } from "@dto/User";
import { Network as NetworkDTO } from "@dto/Network";
import { Gateway as GatewayDTO } from "@models/dto/Gateway";
import { UserDAO } from "@models/dao/UserDAO";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { ErrorDTO } from "@models/dto/ErrorDTO";
import { UserType } from "@models/UserType";
import { SensorDAO } from "@models/dao/SensorDAO";
import { Sensor as SensorDTO } from "@dto/Sensor";
import { Measurement as MeasurementDTO } from "@models/dto/Measurement";
import { MeasurementDAO } from "@models/dao/MeasurementDAO";
import { Measurements as MeasurementsDTO } from "@models/dto/Measurements";
import { Stats as StatsDTO } from "@models/dto/Stats";

// ERROR
export function createErrorDTO(
  code: number,
  message?: string,
  name?: string
): ErrorDTO {
  return removeNullAttributes({
    code,
    name,
    message
  }) as ErrorDTO;
}

// TOKEN
export function createTokenDTO(token: string): TokenDTO {
  return removeNullAttributes({
    token: token
  }) as TokenDTO;
}

// USER
export function createUserDTO(
  username: string,
  type: UserType,
  password?: string
): UserDTO {
  return removeNullAttributes({
    username,
    type,
    password
  }) as UserDTO;
}

export function mapUserDAOToDTO(userDAO: UserDAO): UserDTO {
  return createUserDTO(userDAO.username, userDAO.type);
}

// SENSOR
export function createSensorDTO(
  macAddress: string,
  name: string,
  description: string,
  variable: string,
  unit: string
): SensorDTO {
  return removeNullAttributes({
    macAddress,
    name,
    description,
    variable,
    unit
  }) as SensorDTO;
}

export function mapSensorDAOToDTO(sensorDAO: SensorDAO): SensorDTO {
  return createSensorDTO(sensorDAO.macAddress, sensorDAO.name, sensorDAO.description, sensorDAO.variable, sensorDAO.unit);
}

// GATEWAY
export function createGatewayDTO(
  macAddress: string,
  name: string,
  description: string,
  sensors: SensorDTO[],
): GatewayDTO {
  return removeNullAttributes({
    macAddress,
    name,
    description,
    sensors
  }) as GatewayDTO;
}

export function mapGatewayDAOToDTO(gatewayDAO: GatewayDAO): GatewayDTO {
  return createGatewayDTO(gatewayDAO.macAddress, gatewayDAO.name, gatewayDAO.description, gatewayDAO.sensors.map(mapSensorDAOToDTO));
}

// NETWORK
export function createNetworkDTO(
  code: string,
  name: string,
  description: string,
  gateways: GatewayDTO[],
): NetworkDTO {
  return removeNullAttributes({
    code,
    name,
    description,
    gateways
  }) as NetworkDTO;
}

export function mapNetworkDAOToDTO(networkDAO: NetworkDAO): NetworkDTO {
  return createNetworkDTO(networkDAO.code, networkDAO.name, networkDAO.description, networkDAO.gateways.map(mapGatewayDAOToDTO));
}

// STATS
export function createStatsDTO(
  startDate: Date,
  endDate: Date,
  mean: number,
  variance: number,
  upperThreshold: number,
  lowerThreshold: number
): StatsDTO {
  return removeNullAttributes({
    startDate,
    endDate,
    mean,
    variance,
    upperThreshold,
    lowerThreshold
  }) as StatsDTO;
}

// se non ci sono misurazioni l'oggetto statsDTO restituito avrà tutti
// i campi settati a 0.
export function mapToStatsDTO(
  startDate: Date,
  endDate: Date,
  mean: number,
  variance: number,
  upperThreshold: number,
  lowerThreshold: number): StatsDTO {
  return createStatsDTO(startDate, endDate, mean, variance, upperThreshold, lowerThreshold);
}

// MEASUREMENT
export function createMeasurementDTO(
  createdAt: Date,
  value: number,
  isOutlier?: boolean
): MeasurementDTO {
  return removeNullAttributes({
    createdAt,
    value,
    isOutlier
  }) as MeasurementDTO
}

export function mapMeasurementDAOToDTO(measurementDAO: MeasurementDAO, lowerThreshold: number, upperThreshold: number): MeasurementDTO {
  let isOutlier = false;
  if (measurementDAO.value < lowerThreshold || measurementDAO.value > upperThreshold) {
    isOutlier = true;
  }
  return createMeasurementDTO(measurementDAO.createdAt, measurementDAO.value, isOutlier);
}

// MEASUREMENTS
export function createMeasurementsDTO(
  sensorMacAddress: string,
  stats: StatsDTO,
  measurements: MeasurementDTO[] 
): MeasurementsDTO {
  return removeNullAttributes({
    sensorMacAddress,
    stats,
    measurements
  }) as MeasurementsDTO
}

// condiviso tra network e sensor
export function mapToMeasurementsDTO(
  sensorMac: string,
  startDate: Date,
  endDate: Date,
  mean: number,
  variance: number,
  upperThreshold: number,
  lowerThreshold: number,
  measurements: MeasurementDAO[]
): MeasurementsDTO {

  if (measurements.length == 0) {
    return createMeasurementsDTO(sensorMac, null, null);
  }

  const statsDTO = mapToStatsDTO(startDate, endDate, mean, variance, upperThreshold, lowerThreshold);
  const measurementDTOs = measurements.map(m => mapMeasurementDAOToDTO(m, lowerThreshold, upperThreshold));
  return createMeasurementsDTO(sensorMac, statsDTO, measurementDTOs);
}

// solo per network
export function maptToStatisticsDTOForNetwork(
  sensorMac: string,
  startDate: Date,
  endDate: Date,
  mean: number,
  variance: number,
  upperThreshold: number,
  lowerThreshold: number,
  measurements: MeasurementDAO[]
): MeasurementsDTO {

  if (measurements.length == 0) {
    return createMeasurementsDTO(sensorMac, null, null);
  }

  const statsDTO = mapToStatsDTO(startDate, endDate, mean, variance, upperThreshold, lowerThreshold);
  return createMeasurementsDTO(sensorMac, statsDTO, null);
}

// condiviso tra network e sensor
export function mapToMeasurementsDTOOutliers(
  sensorMac: string,
  startDate: Date,
  endDate: Date,
  mean: number,
  variance: number,
  upperThreshold: number,
  lowerThreshold: number,
  measurements: MeasurementDAO[]
): MeasurementsDTO {
  
  if (measurements.length == 0) {
    return createMeasurementsDTO(sensorMac, null, null);
  }

  const outliers = measurements.filter(measurement => measurement.value < lowerThreshold || measurement.value > upperThreshold);

  const statsDTO = mapToStatsDTO(startDate, endDate, mean, variance, upperThreshold, lowerThreshold);
  const measurementDTOs = outliers.length>0 ? outliers.map(m => mapMeasurementDAOToDTO(m, lowerThreshold, upperThreshold)) : [];
  return createMeasurementsDTO(sensorMac, statsDTO, measurementDTOs);
}

// FARE UNA SECONDA VERSIONE CHE NON RIMUOVA ARRAY VUOTI ???
function removeNullAttributes<T>(dto: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(dto).filter(
      ([_, value]) =>
        value !== null &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0)
    )
  ) as Partial<T>;
}