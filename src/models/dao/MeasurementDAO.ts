import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { SensorDAO } from "./SensorDAO";

@Entity("measurement")
export class MeasurementDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'datetime' })
    createdAt: Date;

    @Column({ nullable: false, type: 'float' })
    value: number;

    // foreign key
    @Column({ nullable: false })
    sensorId: number;

    @ManyToOne(() => SensorDAO, sensor => sensor.measurements, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'sensorId' })
    sensor: SensorDAO;
}