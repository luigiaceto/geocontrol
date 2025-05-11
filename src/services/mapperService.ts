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

//GATEWAY
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

//NETWORK
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
