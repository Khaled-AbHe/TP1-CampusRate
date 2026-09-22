import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { JsonDb } from '../jsondb.js';
import { Review } from './entities/review.entity.js';

@Injectable()
export class ReviewsService {
  private readonly jdb: JsonDb = new JsonDb('reviews');

  async createReview(dto: CreateReviewDto) {
    const allReviews = await this.findAllReviews();
    const review = new Review(dto);
    allReviews.push(review);
    await this.jdb.writeData(allReviews);

    return { message: 'Review created successfully!', data: review };
  }

  async findAllReviews(): Promise<Review[]> {
    return await this.jdb.readData();
  }

  async findOneReviewById(id: string) {
    const review = (await this.findAllReviews()).find(
      (review) => review.id === id,
    );

    if (!review) throw new NotFoundException('Review doesnt exist');

    return review;
  }

  async updateReviewById(id: string, dto: UpdateReviewDto) {
    const allReviews = await this.findAllReviews();

    const updatedReviews = allReviews.map((review) =>
      review.id === id ? { ...review, ...dto, updatedAt: new Date() } : review,
    );

    await this.jdb.writeData(updatedReviews);

    return {
      message: 'Review updated successfully!',
      data: await this.findOneReviewById(id),
    };
  }

  async removeReviewById(id: string) {
    const allReviews = await this.findAllReviews();
    const targetReview = await this.findOneReviewById(id);

    const updatedReviews = allReviews.filter(
      (review) => review.id !== targetReview.id,
    );

    await this.jdb.writeData(updatedReviews);

    return {
      message: 'Review removed successfully!',
      removed_review: targetReview,
      data: updatedReviews,
    };
  }
}
