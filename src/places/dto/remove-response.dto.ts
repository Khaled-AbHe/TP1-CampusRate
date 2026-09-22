import { ApiProperty } from '@nestjs/swagger';
import { Place } from '../entities/place.entity.js';

export class RemovePlaceResponseDto {
  @ApiProperty({ example: 'Place removed successfully!' })
  message!: string;

  @ApiProperty({
    type: Place,
    description: "L'endroit qui vient d'être supprimé",
  })
  removed_place!: Place;

  @ApiProperty({
    type: [Place],
    description: 'Les endroits restants après suppression',
  })
  data!: Place[];
}
