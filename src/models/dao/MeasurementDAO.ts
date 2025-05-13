import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { SensorDAO } from "./SensorDAO";

@Entity("measurement")
export class MeasurementDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'datetime' })
    createdAt: Date;

    @Column({ nullable: false })
    value: number;

    // foreign key
    @Column({ nullable: false })
    sensorId: number;

    @ManyToOne(() => SensorDAO, sensor => sensor.measurements, {
        onDelete: 'CASCADE', // Se un network viene eliminato, elimina anche i suoi gateway
    })
    @JoinColumn({ name: 'sensorId' }) // Specifica che networkId è la colonna che contiene la foreign key (pk di network)
    sensor: SensorDAO;
}