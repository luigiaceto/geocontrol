import { AppDataSource } from "@database";
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { MeasurementDAO } from "@models/dao/MeasurementDAO";

export class MeasurementRepository {
  private repo: Repository<MeasurementDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(MeasurementDAO);
  }

  getMeasurementsBySensorId(sensorId: number, start: Date, end: Date): Promise<MeasurementDAO[]> { 
    if (start === undefined && end === undefined) {
        return this.repo.find({ where: { sensorId } });
    }
    
    if (end === undefined) {
       return this.repo.find({ where: {
         sensorId,
         createdAt: MoreThanOrEqual(start)
       }})
    }
    
    if (start === undefined) {
       return this.repo.find({ where: {
         sensorId,
         createdAt: LessThanOrEqual(end)
       }})
    } 

    return this.repo.find({ where: {
        sensorId,
        createdAt: Between(start, end)
     }});
  }

  async getMeasurementsBySensorsId(sensorsId: Array<number>, start: Date, end: Date): Promise<MeasurementDAO[]> {
    const promises = sensorsId.map(id => this.getMeasurementsBySensorId(id, start, end));
    const results = await Promise.all(promises);
    return results.flat();
  }

  async createMeasurement(
    createdAt: Date,
    value: number,
    sensorId: number
  ): Promise<MeasurementDAO> {
  
    return this.repo.save({
      createdAt: createdAt,
      value: value,
      sensorsId: sensorId
    });
  }
}