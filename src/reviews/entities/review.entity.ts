import RandExp from 'randexp';
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
    this.id = new RandExp(/^rev_01J[A-Z]{3}\d{3}$/).gen();
    this.placeId = dto.placeId;
    this.authorName = dto.authorName;
    this.rating = dto.rating;
    this.comment = dto.comment;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
