import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { GatewayDAO } from "./GatewayDAO";

@Entity("sensors")
export class SensorDAO {
  @PrimaryColumn({ nullable: false })
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
  gatewayMac: string;

  @ManyToOne(() => GatewayDAO, gateway => gateway.sensors, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: "gatewayMac" }) // Collega gatewayMac alla primaryKey di Gateway
  gateway: GatewayDAO;
}