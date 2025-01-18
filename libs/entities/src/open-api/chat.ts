import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Chat extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  public message!: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'uuid', nullable: false })
  public ownerId: string;

  @CreateDateColumn()
  public createdAt: Date;

  constructor(partial: Partial<Chat>) {
    super();
    Object.assign(this, partial);
  }
}
