import { AppDataSource } from "@database";
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository, LessThan, MoreThan } from "typeorm";
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

  //ritorna solo i valori anomali, cioè quando variabile isOutlier è true
  getOutliersMeasurementsBySensorId(sensorId: number, start: Date, end: Date, upperThreshold: number, lowerThreshold: number): Promise<MeasurementDAO[]> {
    const baseTimeCondition: any = { sensorId };

    if (start && end) {
      baseTimeCondition.createdAt = Between(start, end);
    } else if (start) {
      baseTimeCondition.createdAt = MoreThanOrEqual(start);
    } else if (end) {
      baseTimeCondition.createdAt = LessThanOrEqual(end);
    }

    // Valori fuori soglia: < lower OR > upper
    return this.repo.find({
      where: [
        { ...baseTimeCondition, value: LessThan(lowerThreshold) },
        { ...baseTimeCondition, value: MoreThan(upperThreshold) }
      ]
    });
  }

  async getMeasurementsBySensorsId(sensorsId: Array<number>, start: Date, end: Date): Promise<MeasurementDAO[]> {
    /* probabilmente sbagliata
    const promises = sensorsId.map(id => this.getMeasurementsBySensorId(id, start, end));
    const results = await Promise.all(promises);
    return results.flat();
    */
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