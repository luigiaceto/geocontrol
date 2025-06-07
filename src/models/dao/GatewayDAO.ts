import { Entity, Column, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { SensorDAO } from "./SensorDAO";
import { NetworkDAO } from "./NetworkDAO";

@Entity("gateways")
export class GatewayDAO {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    macAddress: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    // foreign key
    @Column({ nullable: false })
    networkId: number;

    @ManyToOne(() => NetworkDAO, network => network.gateways, {
        onDelete: 'CASCADE', // Se un network viene eliminato, elimina anche i suoi gateway
    })
    @JoinColumn({ name: 'networkId' }) // Specifica che networkId è la colonna che contiene la foreign key (pk di network)
    network: NetworkDAO;

    @OneToMany(() => SensorDAO, sensor => sensor.gateway, {
        cascade: true,
        eager: true, // Carica automaticamente i sensori quando si carica un gateway
    })
    sensors: SensorDAO[];
}