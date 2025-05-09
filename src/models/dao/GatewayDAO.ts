import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { SensorDAO } from "./SensorDAO";
import { NetworkDAO } from "./NetworkDAO";

@Entity("gateways")
export class GatewayDAO {
    @PrimaryColumn({ nullable: false })
    macAddress: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    description: string;

    // foreign key
    @Column({ nullable: false })
    networkCode: string;

    @ManyToOne(() => NetworkDAO, network => network.gateways, {
        onDelete: 'CASCADE', // Se un network viene eliminato, elimina anche i suoi gateway
        onUpdate: 'CASCADE', // Se il codice del network cambia, aggiorna anche il riferimento nei gateway
      })
    @JoinColumn({ name: 'networkCode' }) // Specifica che networkCode è la colonna che contiene la foreign key
    network: NetworkDAO;

    @OneToMany(() => SensorDAO, sensor => sensor.gateway, {
        cascade: true,
        eager: true, // Carica automaticamente i sensori quando si carica un gateway
    })
    sensors: SensorDAO[];
}