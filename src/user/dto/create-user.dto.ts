import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from '../enum/user-type.enum.js';

export class CreateUserDto {
  @ApiProperty({
    description: "Nom de l'utilisateur (unique)",
    example: 'Khaled',
  })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur (stocké haché)",
    example: 'abc123',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    description: "Le type d'utilisateur",
    enum: UserType,
    example: UserType.ETUDIANT,
  })
  @IsEnum(UserType)
  @IsNotEmpty()
  userType!: UserType;
}
