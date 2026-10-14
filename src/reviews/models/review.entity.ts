import RandExp from 'randexp';
import { ApiProperty } from '@nestjs/swagger';
import { CreateReviewDto } from '../dto/create-review.dto.js';

export class Review {
  @ApiProperty({
    description:
      "Identifiant unique de l'appréciation. (rev_01J[3 caractères majusticule][3 chiffres])",
    example: 'rev_01JABC123',
  })
  id!: string;

  @ApiProperty({
    description: "Identifiant de l'endroit concerné par l'appréciation",
    example: 'plc_01JABC123',
  })
  placeId!: string;

  @ApiProperty({
    description: "Nom de l'auteur de l'appréciation",
    example: 'Camille Tremblay',
  })
  authorName!: string;

  @ApiProperty({
    description: "Note attribuée à l'endroit, de 1 à 5",
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  rating!: number;

  @ApiProperty({
    description: "Commentaire laissé par l'auteur de l'appréciation",
    example: 'Endroit calme et bien situé, parfait pour étudier.',
  })
  comment!: string;

  @ApiProperty({
    description: "Date de création de l'appréciation",
    example: '2026-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: "Date de dernière modification de l'appréciation",
    example: '2026-02-01T08:00:00.000Z',
  })
  updatedAt: Date;

  constructor(dto: CreateReviewDto) {
    this.id = new RandExp(/^rev_01J[A-Z]{3}\d{3}$/).gen();
    this.placeId = dto.placeId;
    this.authorName = dto.authorName;
    this.rating = dto.rating;
    this.comment = dto.comment;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
