import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { RoleEnum } from '../enum/role';

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false, unique: true })
  public email!: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  public username: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'text', nullable: true })
  public ip!: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'text', nullable: true })
  public useragent: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    nullable: false,
    enum: RoleEnum,
    default: RoleEnum.user,
  })
  public role: RoleEnum;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'text', nullable: true })
  public password: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'text', nullable: true })
  public googleId: string;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
