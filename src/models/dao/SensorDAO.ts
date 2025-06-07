import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { GatewayDAO } from "./GatewayDAO";
import { MeasurementDAO } from "./MeasurementDAO";

@Entity("sensors")
export class SensorDAO {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  macAddress: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  variable: string;

  @Column({ nullable: true })
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
    cascade: true,
    eager: true, // Carica automaticamente i sensori quando si carica un gateway
  })
  measurements: MeasurementDAO[];
}