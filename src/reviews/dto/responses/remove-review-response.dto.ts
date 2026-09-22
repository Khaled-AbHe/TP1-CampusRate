import { ApiProperty } from '@nestjs/swagger';
import { Review } from '../../entities/review.entity.js';

export class RemoveReviewResponseDto {
  @ApiProperty({ example: 'Review removed successfully!' })
  message!: string;

  @ApiProperty({
    type: Review,
    description: "L'appréciation qui vient d'être supprimée",
  })
  removed_review!: Review;

  @ApiProperty({
    type: [Review],
    description: 'Les appréciations restantes après suppression',
  })
  data!: Review[];
}
