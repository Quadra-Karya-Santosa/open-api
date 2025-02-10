import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Telegram extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  public name!: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'text', nullable: false })
  public chatId: string;

  constructor(partial: Partial<Telegram>) {
    super();
    Object.assign(this, partial);
  }
}
