import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { GatewayDAO } from "./GatewayDAO";

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
  gatewayId: string;

  @ManyToOne(() => GatewayDAO, gateway => gateway.sensors, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: "gatewayId" })
  gateway: GatewayDAO;
}