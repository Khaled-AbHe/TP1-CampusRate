import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { JsonDb } from '../jsondb.js';
import { Review } from './entities/review.entity.js';
import { PlacesService } from '../places/places.service.js';
import { PageOptionsDto } from '../common/dto/pagination/page-options.dto.js';
import { PageDto } from '../common/dto/pagination/page.dto.js';

@Injectable()
export class ReviewsService {
  private readonly jdb: JsonDb<Review> = new JsonDb<Review>('reviews');

  constructor(private placesService: PlacesService) {}

  async createReview(dto: CreateReviewDto) {
    const allReviews = await this.jdb.readData();
    const review = new Review(dto);
    allReviews.push(review);
    await this.jdb.writeData(allReviews);

    await this.syncPlaceRatingStats(review.placeId);

    return { message: 'Review created successfully!', data: review };
  }

  async findAllReviews(dto: PageOptionsDto): Promise<PageDto<Review>> {
    const allPlaces = await this.jdb.readData();

    const start = (dto.page - 1) * dto.limit;

    return {
      data: allPlaces.slice(start, start + dto.limit),
      pagination: {
        page: dto.page,
        limit: dto.limit,
        totalItems: allPlaces.length,
        totalPages: Math.ceil(allPlaces.length / dto.limit),
      },
    };
  }

  async findOneReviewById(id: string) {
    const review = (await this.jdb.readData()).find(
      (review) => review.id === id,
    );

    if (!review) throw new NotFoundException('Review doesnt exist');

    return review;
  }

  async updateReviewById(id: string, dto: UpdateReviewDto) {
    const previousReview = await this.findOneReviewById(id); // get the review as reference
    const allReviews = await this.jdb.readData();

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
    const allReviews = await this.jdb.readData();
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
    const relevantReviews = (await this.jdb.readData()).filter(
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
