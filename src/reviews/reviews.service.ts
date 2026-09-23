import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { JsonDb } from '../jsondb.js';
import { Review } from './entities/review.entity.js';
import { PlacesService } from '../places/places.service.js';

@Injectable()
export class ReviewsService {
  private readonly jdb: JsonDb = new JsonDb('reviews');

  constructor(private placesService: PlacesService) {}

  async createReview(dto: CreateReviewDto) {
    const allReviews = await this.findAllReviews();
    const review = new Review(dto);
    allReviews.push(review);
    await this.jdb.writeData(allReviews);

    await this.syncPlaceRatingStats(review.placeId);

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
    const previousReview = await this.findOneReviewById(id); // get the review as reference
    const allReviews = await this.findAllReviews();

    const updatedReviews = allReviews.map((review) =>
      review.id === id ? { ...review, ...dto, updatedAt: new Date() } : review,
    );

    await this.jdb.writeData(updatedReviews);

    // If the placeId got changed, then we have to update the old place and the new place
    await this.syncPlaceRatingStats(previousReview.placeId);
    if (dto.placeId && dto.placeId !== previousReview.placeId) {
      await this.syncPlaceRatingStats(dto.placeId);
    }

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

    await this.syncPlaceRatingStats(targetReview.placeId);

    return {
      message: 'Review removed successfully!',
      removed_review: targetReview,
      data: updatedReviews,
    };
  }

  private async syncPlaceRatingStats(placeId: string) {
    const relevantReviews = (await this.findAllReviews()).filter(
      (review) => review.placeId === placeId,
    );

    const reviewCount = relevantReviews.length;
    const averageRating =
      reviewCount > 0
        ? relevantReviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewCount
        : null;

    await this.placesService.updatePlaceById(placeId, {
      averageRating: !averageRating ? averageRating : +averageRating.toFixed(1),
      reviewCount: reviewCount,
    });
  }
}
