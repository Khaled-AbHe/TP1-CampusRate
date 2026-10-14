import { ApiProperty } from '@nestjs/swagger';
import { Review } from '../../models/review.entity.js';

export class UpdateReviewResponseDto {
  @ApiProperty({ example: 'Review updated successfully!' })
  message!: string;

  @ApiProperty({
    type: Review,
    description: "L'appréciation qui vient d'être mise à jour",
  })
  data!: Review;
}
