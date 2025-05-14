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
  sensorDTOs: SensorDTO[],
): GatewayDTO {
  return removeNullAttributes({
    macAddress,
    name,
    description,
    sensorDTOs
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
  gatewayDTOs: GatewayDTO[],
): NetworkDTO {
  return removeNullAttributes({
    code,
    name,
    description,
    gatewayDTOs
  }) as NetworkDTO;
}

export function mapNetworkDAOToDTO(networkDAO: NetworkDAO): NetworkDTO {
  return createNetworkDTO(networkDAO.code, networkDAO.name, networkDAO.description, networkDAO.gateways.map(mapGatewayDAOToDTO));
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

// MEASUREMENTS
export function createMeasurementsDTO(
  sensorMac: string,
  statsDTO: StatsDTO,
  measurementDTOs: MeasurementDTO[] 
): MeasurementsDTO {
  return removeNullAttributes({
    sensorMac,
    statsDTO,
    measurementDTOs
  }) as MeasurementsDTO
}

// se non ci sono misurazioni viene restituito un oggetto measurementsDTO contenente
// solo il campo required macAddress.
export function mapToMeasurementsDTO(
  sensorMac: string,
  startDate: Date,
  endDate: Date,
  mean: number,
  variance: number,
  lowerThreshold: number,
  upperThreshold: number,
  measurements: MeasurementDAO[]
): MeasurementsDTO {
  let statsDTO = null;
  let measurementDTOs = null;
  if (measurements.length > 0) {
    statsDTO = mapToStatsDTO(startDate, endDate, mean, variance, upperThreshold, lowerThreshold);
    measurementDTOs = measurements.map(m => mapMeasurementDAOToDTO(m, lowerThreshold, upperThreshold));
  }
  return createMeasurementsDTO(sensorMac, statsDTO, measurementDTOs);
}

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
