import { ApiProperty } from '@nestjs/swagger';
import { Place } from '../entities/place.entity.js';

export class CreatePlaceResponseDto {
  @ApiProperty({ example: 'Place created successfully!' })
  message!: string;

  @ApiProperty({
    type: Place,
    description: "L'endroit qui vient d'être créé",
  })
  data!: Place;
}
