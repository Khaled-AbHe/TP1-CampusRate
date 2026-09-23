import { ApiProperty } from '@nestjs/swagger';

export class ProblemDetailsDto {
  @ApiProperty({
    description: '',
    example: '',
  })
  type!: string;

  @ApiProperty({
    description: "Titre de l'erreur.",
    example: 'Not Found',
  })
  title!: string;

  @ApiProperty({
    description: 'Code de statut HTTP de cette réponse.',
    example: 404,
  })
  status!: number;

  @ApiProperty({
    description: 'Explication du problème.',
    example: "Aucun endroit ne correspond à l'identifiant fourni.",
  })
  detail!: string;

  @ApiProperty({
    description: 'Le chemin de la requête concernée.',
    example: '/api/v1/places/plc_01JABC123',
  })
  instance!: string;
}
