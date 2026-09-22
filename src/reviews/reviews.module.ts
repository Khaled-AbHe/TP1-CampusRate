import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { ReviewsController } from './reviews.controller.js';
import { PlacesModule } from '../places/places.module.js';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [PlacesModule],
})
export class ReviewsModule {}
