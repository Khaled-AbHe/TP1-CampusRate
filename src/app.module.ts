import { Global, Module } from '@nestjs/common';
import { PlacesModule } from './places/places.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { StorageService } from './storage.service.js';

@Global()
@Module({
  imports: [PlacesModule, ReviewsModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class AppModule {}
