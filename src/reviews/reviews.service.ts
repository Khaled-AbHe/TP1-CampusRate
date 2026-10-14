import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageOptionsDto } from '../common/pagination/dto/page-options.dto.js';
import { PageDto } from '../common/pagination/dto/page.dto.js';
import { PlacesService } from '../places/places.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { Review } from './models/review.schema.js';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private placesService: PlacesService,
  ) {}

  async createReview(dto: CreateReviewDto) {
    const review = await this.reviewModel.create(dto);

    await this.syncPlaceRatingStats(review.placeId);

    return { message: 'Review created successfully!', data: review };
  }

  async findAllReviews(dto: PageOptionsDto): Promise<PageDto<Review>> {
    const allReviews = await this.reviewModel.find().exec();

    const start = (dto.page - 1) * dto.limit;

    return {
      data: allReviews.slice(start, start + dto.limit),
      pagination: {
        page: dto.page,
        limit: dto.limit,
        totalItems: allReviews.length,
        totalPages: Math.ceil(allReviews.length / dto.limit),
      },
    };
  }

  async findOneReviewById(id: string) {
    const review = await this.reviewModel.findById(id).exec();

    if (!review) throw new NotFoundException('Review doesnt exist');

    return review;
  }

  async updateReviewById(id: string, dto: UpdateReviewDto) {
    const previousReview = await this.findOneReviewById(id); // get the review as reference

    const review = await this.reviewModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!review) throw new NotFoundException('Review doesnt exist');

    // If the placeId got changed, then we have to update the old place and the new place
    await this.syncPlaceRatingStats(previousReview.placeId);
    if (dto.placeId && dto.placeId !== previousReview.placeId) {
      await this.syncPlaceRatingStats(dto.placeId);
    }

    return {
      message: 'Review updated successfully!',
      data: review,
    };
  }

  async removeReviewById(id: string) {
    const targetReview = await this.reviewModel.findByIdAndDelete(id).exec();

    if (!targetReview) throw new NotFoundException('This review doesnt exist');

    await this.syncPlaceRatingStats(targetReview.placeId);

    return {
      message: 'Review removed successfully!',
      removed_review: targetReview,
      data: await this.reviewModel.find().exec(),
    };
  }

  private async syncPlaceRatingStats(placeId: string) {
    const relevantReviews = (await this.reviewModel.find().exec()).filter(
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
