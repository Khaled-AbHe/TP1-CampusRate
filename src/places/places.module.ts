import { Module } from '@nestjs/common';
import { PlacesService } from './places.service.js';
import { PlacesController } from './places.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from './models/place.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
  ],
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [PlacesService],
})
export class PlacesModule {}
