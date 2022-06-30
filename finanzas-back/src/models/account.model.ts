import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany} from 'typeorm'
import { Bono } from './bonos.mode';

@Entity('accounts')
export class Account extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  
  @Column()
  dni: string;

  @OneToMany(() => Bono, bono => bono.account)
  bonos: Bono[];



}