import { Column } from "typeorm";

export abstract class BaseEntity {
    
    @Column({
        type: 'timestamp',
        name: 'created_at'
    })
    createdAt: Date;
}