import { Module } from '@nestjs/common';
import { PlacesModule } from './places/places.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';

@Module({
  imports: [PlacesModule, ReviewsModule],
})
export class AppModule {}
