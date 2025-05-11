import { AppDataSource } from "@database";
import { Repository } from "typeorm";
import { GatewayDAO } from "@dao/GatewayDAO";
import { NetworkRepository } from "./NetworkRepository";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";
import { Gateway as GatewayDTO } from "@dto/Gateway";

export class GatewayRepository {
  private repo: Repository<GatewayDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(GatewayDAO);
  }
    
  getGatewaysByNetworkCode(networkCode: string): Promise<GatewayDAO[]> {
    return this.repo.find({ where: { networkCode } });
  }

  async getGatewayByMac(macAddress: string): Promise<GatewayDAO> { 
    return findOrThrowNotFound(
      await this.repo.find({ where: { macAddress } }),
      () => true,
      `Gateway with Mac Address '${macAddress}' not found`
    );
  }

  async createGateway(
    macAddress: string,
    name: string,
    description: string,
    networkCode: string
  ): Promise<GatewayDAO> {
    throwConflictIfFound(
      await this.repo.find({ where: { macAddress } }),
      () => true,
      `Gateway with Mac Address '${macAddress}' already exists`
    );
  
    return this.repo.save({
      macAddress: macAddress,
      name: name,
      description: description,
      networkCode: networkCode
    });
  }

  async updateGateway(
    macAddress: string,
    gatewayDTO: GatewayDTO
  ): Promise<GatewayDAO> {
    // N.B. il catch degli errori è già fatto a livello di routes
    let toUpdateGateway = await this.getGatewayByMac(macAddress);

    if ( gatewayDTO.macAddress !== undefined && gatewayDTO.macAddress !== macAddress) {
      throwConflictIfFound(
        await this.repo.find({ where: { macAddress: gatewayDTO.macAddress } }),
        () => true,
        `Gateway with Mac Address '${macAddress}' already exists`
      );
    }
    
    if (gatewayDTO.macAddress !== undefined) toUpdateGateway.macAddress = gatewayDTO.macAddress;
    if (gatewayDTO.name !== undefined) toUpdateGateway.name = gatewayDTO.name;
    if (gatewayDTO.description !== undefined) toUpdateGateway.description = gatewayDTO.description;

    return this.repo.save(toUpdateGateway);
  }

  async deleteGateway(macAddress: string): Promise<void> {
    await this.repo.remove(await this.getGatewayByMac(macAddress));
  }
}