import { Entity, PrimaryColumn, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GatewayDAO } from "./GatewayDAO";

@Entity("networks")
export class NetworkDAO {
    // la chiave primaria è surrogata autoincrementata
    @PrimaryGeneratedColumn()
    id: number;

    // logicamente è la chiave primaria, dunque nelle 
    // modifiche e negli inserimenti occorre controllare
    // che non venga duplicata
    @Column({ nullable: false })
    code: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => GatewayDAO, gateway => gateway.network, {
        //cascade: true,
        eager: true,
    })
    gateways: GatewayDAO[];

}