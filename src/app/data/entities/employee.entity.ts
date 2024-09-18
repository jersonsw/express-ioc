import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'employees'})
export class EmployeeEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({type: 'varchar', name: 'name'})
    name!: string;

    @Column({type: 'varchar', name: 'email'})
    email!: string;

    @Column({type: 'varchar', name: 'password'})
    password!: string;

    @Column({type: 'timestamptz', name: 'created_at'})
    createdAt!: Date;

    @Column({type: 'timestamptz', name: 'updated_at'})
    updatedAt!: Date;
}
