import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Account } from "./account.model";

@Entity("bonos")
export class Bono extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  VNominal: string;
  @Column()
  VComercial: string;
  @Column()
  NA: string;
  @Column()
  Fcupon: string;
  @Column()
  DXA: string;
  @Column()
  TDeTasa: string;
  @Column()
  Capit: string;
  @Column()
  TI: string;
  @Column()
  TAD: string;
  @Column()
  IR: string;
  @Column()
  FEmision: string;
  @Column()
  inv: string;
  @Column()
  moneda: string;

  @Column()
  precioActual: string;

  @Column()
  utilidad_o_Perdida: string;

  @Column()
  duracion: string;

  @Column()
  convexidad: string;

  @Column()
  total: string;

  @Column()
  duracionModificada: string;

  @Column()
  VAN: string;

  @Column()
  TIR: string;

  @ManyToOne(() => Account, (account) => account.bonos)
  account: Account;
}
