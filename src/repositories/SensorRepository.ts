import { AppDataSource } from "@database";
import { Repository } from "typeorm";
import { SensorDAO } from "@dao/SensorDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";
import { Sensor as SensorDTO } from "@dto/Sensor";

export class SensorRepository {
  private repo: Repository<SensorDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(SensorDAO);
  }

  getSensorsByGatewayId(gatewayId: number): Promise<SensorDAO[]> {
    return this.repo.find({ where: { gatewayId } });
  }

  async getSensorByMac(macAddress: string): Promise<SensorDAO> { // definita async poichè deve aspettare un eventuale errore
    return findOrThrowNotFound(
        await this.repo.find({ where: { macAddress } }),
        () => true,
        `Sensor with mac address '${macAddress}' not found`
    );
  }

  async createSensor(
    macAddress: string,
    name: string,
    description: string,
    variable: string,
    unit: string,
    gatewayId: number
  ): Promise<SensorDAO> {
    throwConflictIfFound(
      await this.repo.find({ where: { macAddress } }),
      () => true,
      `Sensor with mac address '${macAddress}' already exists`
    );

    return this.repo.save({
      macAddress: macAddress,
      name: name,
      description: description,
      variable: variable,
      unit: unit,
      gatewayId: gatewayId
    });
  }

  async updateSensor(
    macAddress: string,
    sensorDTO: SensorDTO
  ): Promise<SensorDAO> {
    // N.B. il catch degli errori è già fatto a livello di routes
    let toUpdateSensor = await this.getSensorByMac(macAddress);

    if (sensorDTO.macAddress !== undefined && sensorDTO.macAddress !== macAddress) {
      throwConflictIfFound(
        await this.repo.find({ where: { macAddress: sensorDTO.macAddress } }),
        () => true,
        `Sensor with mac address '${macAddress}' already exists`
      );
    }
    
    if (sensorDTO.macAddress !== undefined) toUpdateSensor.macAddress = sensorDTO.macAddress;
    if (sensorDTO.name !== undefined) toUpdateSensor.name = sensorDTO.name;
    if (sensorDTO.description !== undefined) toUpdateSensor.description = sensorDTO.description;
    if (sensorDTO.variable !== undefined) toUpdateSensor.variable = sensorDTO.variable;
    if (sensorDTO.unit !== undefined) toUpdateSensor.unit = sensorDTO.unit;

    return this.repo.save(toUpdateSensor);
  }

  async deleteSensor(macAddress: string): Promise<void> {
    await this.getSensorByMac(macAddress);
    await this.repo.remove(await this.getSensorByMac(macAddress));
  }
}