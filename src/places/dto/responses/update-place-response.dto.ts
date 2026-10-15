import { ApiProperty } from '@nestjs/swagger';
import { Place } from '../../models/place.schema.js';

export class UpdatePlaceResponseDto {
  @ApiProperty({ example: 'Place updated successfully!' })
  message!: string;

  @ApiProperty({
    type: Place,
    description: "L'endroit qui vient d'être mis à jours",
  })
  data!: Place;
}
