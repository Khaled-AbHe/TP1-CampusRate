import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlacesService } from './places.service.js';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.createPlace(createPlaceDto);
  }

  @Get()
  findAllPlaces() {
    return this.placesService.findAllPlaces();
  }

  @Get(':id')
  findOnePlaceById(@Param('id') id: string) {
    return this.placesService.findOnePlaceById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlaceDto) {
    return this.placesService.updatePlaceById(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placesService.removePlaceById(id);
  }
}
