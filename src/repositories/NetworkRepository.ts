import { AppDataSource } from "@database";
import { Repository } from "typeorm";
import { NetworkDAO } from "@dao/NetworkDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";
import { Network as NetworkDTO } from "@dto/Network";

export class NetworkRepository {
  private repo: Repository<NetworkDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(NetworkDAO);
  }

  getAllNetworks(): Promise<NetworkDAO[]> {
    return this.repo.find();
  }

  async getNetworkByCode(code: string): Promise<NetworkDAO> {
    return findOrThrowNotFound(
      await this.repo.find({ where: { code } }),
      () => true,
      `Network with code '${code}' not found`
    );
  }

  async createNetwork(
    code: string,
    name: string,
    description: string
  ): Promise<NetworkDAO> {
    throwConflictIfFound(
      await this.repo.find({ where: { code } }),
      () => true,
      `Network with code '${code}' already exists`
    );
  
    return this.repo.save({
      code: code,
      name: name,
      description: description
    });
  }

  async updateNetwork(
  code: string,
  networkDTO: NetworkDTO
): Promise<NetworkDAO> {
  let toUpdateNetwork = await this.getNetworkByCode(code);

  // Se si vuole cambiare il code, controlla che non esista già un network con quel code (diverso da quello attuale)
  if (
    networkDTO.code !== undefined &&
    networkDTO.code !== code
  ) {
    throwConflictIfFound(
      await this.repo.find({ where: { code: networkDTO.code } }),
      () => true,
      `Network with code '${networkDTO.code}' already exists`
    );
    toUpdateNetwork.code = networkDTO.code;
  }

  if (networkDTO.name !== undefined) toUpdateNetwork.name = networkDTO.name;
  if (networkDTO.description !== undefined) toUpdateNetwork.description = networkDTO.description;

  return this.repo.save(toUpdateNetwork);
}

  async deleteNetwork(code: string): Promise<void> {
    await this.repo.remove(await this.getNetworkByCode(code));
  }
}