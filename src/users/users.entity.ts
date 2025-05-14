import { OneToMany, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { Report } from '../reports/report.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
