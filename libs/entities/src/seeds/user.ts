import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SeedsUser extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false, unique: true })
  public phoneNumber!: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'text', nullable: true })
  public password: string;

  constructor(partial: Partial<SeedsUser>) {
    super();
    Object.assign(this, partial);
  }
}
