import { AppDataSource } from "@database";
import { Repository } from "typeorm";
import { GatewayDAO } from "@dao/GatewayDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";
import { Gateway as GatewayDTO } from "@dto/Gateway";

export class GatewayRepository {
  private repo: Repository<GatewayDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(GatewayDAO);
  }
    
  getGatewaysByNetworkId(networkId: number): Promise<GatewayDAO[]> {
    return this.repo.find({ where: { networkId } });
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
    networkId: number
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
      networkId: networkId
    });
  }

  async updateGateway(
    macAddress: string,
    gatewayDTO: GatewayDTO
  ): Promise<GatewayDAO> {
    // N.B. il catch degli errori è già fatto a livello di routes
    let toUpdateGateway = await this.getGatewayByMac(macAddress);

    if (gatewayDTO.macAddress !== undefined && gatewayDTO.macAddress !== macAddress) {
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