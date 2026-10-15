import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: "Nom d'utilisateur",
    example: 'user1',
  })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: 'password1',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
