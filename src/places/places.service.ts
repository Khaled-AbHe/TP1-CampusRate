import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import { PlacesPageOptionsDto } from '../common/pagination/dto/places-page-options.dto.js';
import { PageDto } from '../common/pagination/dto/page.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Place } from './models/place.schema.js';
import { Model } from 'mongoose';

@Injectable()
export class PlacesService {
  constructor(@InjectModel(Place.name) private placeModel: Model<Place>) {}

  async createPlace(dto: CreatePlaceDto) {
    const place = await this.placeModel.create(dto);
    return { message: 'Place created successfully!', data: place };
  }

  async findAllPlaces(dto: PlacesPageOptionsDto): Promise<PageDto<Place>> {
    const allPlaces = await this.placeModel.find().exec();

    const filteredPlaces = dto.categoryFilter
      ? allPlaces.filter((place) => place.category === dto.categoryFilter)
      : allPlaces;

    const start = (dto.page - 1) * dto.limit;

    return {
      data: filteredPlaces.slice(start, start + dto.limit),
      pagination: {
        page: dto.page,
        limit: dto.limit,
        totalItems: filteredPlaces.length,
        totalPages: Math.ceil(filteredPlaces.length / dto.limit),
      },
    };
  }

  async findOnePlaceById(id: string) {
    const place = await this.placeModel.findById(id).exec();

    if (!place) throw new NotFoundException('Place doesnt exist');

    return place;
  }

  async updatePlaceById(
    id: string,
    dto: UpdatePlaceDto | { averageRating: number | null; reviewCount: number },
  ) {
    const place = await this.placeModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!place) throw new NotFoundException('Place doesnt exist');

    return {
      message: 'Place updated successfully!',
      data: place,
    };
  }

  async removePlaceById(id: string) {
    const targetPlace = await this.findOnePlaceById(id);

    if (targetPlace.averageRating !== null || targetPlace.reviewCount !== 0) {
      throw new ConflictException('The place has ratings');
    }

    await this.placeModel.deleteOne(targetPlace).exec();

    return {
      message: 'Place removed successfully!',
      removed_place: targetPlace,
      data: await this.placeModel.find().exec(),
    };
  }
}
