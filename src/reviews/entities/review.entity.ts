import { randomStringGenerator } from '@nestjs/common/internal';
import { CreateReviewDto } from '../dto/create-review.dto.js';

export class Review {
  id!: string;
  placeId!: string;
  authorName!: string;
  rating!: number;
  comment!: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(dto: CreateReviewDto) {
    this.id = 'rev_' + randomStringGenerator(); //temp
    this.placeId = dto.placeId;
    this.authorName = dto.authorName;
    this.rating = dto.rating;
    this.comment = dto.comment;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
