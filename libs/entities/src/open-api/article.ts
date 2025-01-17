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
export class Article extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  public title!: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  public content: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  public author: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'uuid', nullable: false })
  public ownerId: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'text', nullable: true })
  public ip!: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'text', nullable: true })
  public useragent: string;

  @CreateDateColumn()
  public createdAt: Date;

  constructor(partial: Partial<Article>) {
    super();
    Object.assign(this, partial);
  }
}
