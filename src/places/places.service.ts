import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import { JsonDb } from '../common/storage/jsondb.js';
import { Place } from './entities/place.entity.js';
import { PlacesPageOptionsDto } from '../common/pagination/dto/places-page-options.dto.js';
import { PageDto } from '../common/pagination/dto/page.dto.js';

@Injectable()
export class PlacesService {
  private readonly jdb: JsonDb<Place> = new JsonDb<Place>('places');

  async createPlace(dto: CreatePlaceDto) {
    const allPlaces = await this.jdb.readData();
    const place = new Place(dto);
    allPlaces.push(place);
    await this.jdb.writeData(allPlaces);

    return { message: 'Place created successfully!', data: place };
  }

  async findAllPlaces(dto: PlacesPageOptionsDto): Promise<PageDto<Place>> {
    const allPlaces = await this.jdb.readData();

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
    const place = (await this.jdb.readData()).find((place) => place.id === id);

    if (!place) throw new NotFoundException('Place doesnt exist');

    return place;
  }

  async updatePlaceById(
    id: string,
    dto: UpdatePlaceDto | { averageRating: number | null; reviewCount: number },
  ) {
    const allPlaces = await this.jdb.readData();

    const updatedPlaces = allPlaces.map((place) =>
      place.id === id ? { ...place, ...dto, updatedAt: new Date() } : place,
    );

    await this.jdb.writeData(updatedPlaces);

    return {
      message: 'Place updated successfully!',
      data: await this.findOnePlaceById(id),
    };
  }

  async removePlaceById(id: string) {
    const allPlaces = await this.jdb.readData();
    const targetPlace = await this.findOnePlaceById(id);

    if (targetPlace.averageRating !== null || targetPlace.reviewCount !== 0) {
      throw new ConflictException('The place has ratings');
    }

    const updatedPlaces = allPlaces.filter(
      (place) => place.id !== targetPlace.id,
    );

    await this.jdb.writeData(updatedPlaces);

    return {
      message: 'Place removed successfully!',
      removed_place: targetPlace,
      data: updatedPlaces,
    };
  }
}
