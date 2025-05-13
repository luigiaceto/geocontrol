import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { GatewayDAO } from "./GatewayDAO";
import { MeasurementDAO } from "./MeasurementDAO";

@Entity("sensors")
export class SensorDAO {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  macAddress: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  variable: string;

  @Column({ nullable: false })
  unit: string;

  // foreign key 
  @Column({ nullable: false })
  gatewayId: number;

  @ManyToOne(() => GatewayDAO, gateway => gateway.sensors, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: "gatewayId" })
  gateway: GatewayDAO;

  @OneToMany(() => MeasurementDAO, measurement => measurement.sensor, {
    //cascade: true,
    eager: true, // Carica automaticamente i sensori quando si carica un gateway
  })
  measurements: MeasurementDAO[];
}