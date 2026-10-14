import { ApiProperty } from '@nestjs/swagger';
import { Review } from '../../models/review.entity.js';

export class CreateReviewResponseDto {
  @ApiProperty({ example: 'Review created successfully!' })
  message!: string;

  @ApiProperty({
    type: Review,
    description: "L'appréciation qui vient d'être créée",
  })
  data!: Review;
}
