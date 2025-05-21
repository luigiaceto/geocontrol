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

  async storeMeasurement(
    createdAt: Date,
    value: number,
    sensorId: number
  ): Promise<MeasurementDAO> {
  
    return this.repo.save({
      createdAt: createdAt,
      value: value,
      sensorId: sensorId
    });
  }
}