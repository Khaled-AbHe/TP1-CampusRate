import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({
    description: "Identifiant de l'utilisateur authentifié",
    example: 1,
  })
  userId!: number;

  @ApiProperty({
    description: "Nom d'utilisateur authentifié",
    example: 'user1',
  })
  username!: string;
}
