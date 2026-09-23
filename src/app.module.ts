import { Module } from '@nestjs/common';
import { PlacesModule } from './places/places.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PlacesModule,
    ReviewsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
