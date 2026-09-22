import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description:
      "Identifiant de l'endroit concerné par l'appréciation. (plc_01J[3 caractères majusticule][3 chiffres])",
    example: 'plc_01JABC123',
  })
  @IsString()
  @Matches(/^plc_01J[A-Z]{3}\d{3}$/)
  @IsNotEmpty()
  placeId!: string;

  @ApiProperty({
    description: "Nom de l'auteur de l'appréciation",
    example: 'Camille Tremblay',
  })
  @IsString()
  @IsNotEmpty()
  authorName!: string;

  @ApiProperty({
    description: "Note attribuée à l'endroit, de 1 à 5",
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating!: number;

  @ApiProperty({
    description: "Commentaire laissé par l'auteur de l'appréciation",
    example: 'Endroit calme et bien situé, parfait pour étudier.',
  })
  @IsString()
  @IsNotEmpty()
  comment!: string;
}
