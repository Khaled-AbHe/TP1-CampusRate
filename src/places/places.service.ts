import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import { JsonDb } from '../jsondb.js';
import { Place } from './entities/place.entity.js';

@Injectable()
export class PlacesService {
  private readonly jdb: JsonDb = new JsonDb('places');

  async createPlace(dto: CreatePlaceDto) {
    const allPlaces = await this.findAllPlaces();
    const place = new Place(dto);
    allPlaces.push(place);
    await this.jdb.writeData(allPlaces);

    return { message: 'Place created successfully!', data: place };
  }

  async findAllPlaces(): Promise<Place[]> {
    return await this.jdb.readData();
  }

  async findOnePlaceById(id: string) {
    const place = (await this.findAllPlaces()).find((place) => place.id === id);

    if (!place) throw new NotFoundException('Place doesnt exist');

    return place;
  }

  async updatePlaceById(
    id: string,
    dto: UpdatePlaceDto | { averageRating: number | null; reviewCount: number },
  ) {
    const allPlaces = await this.findAllPlaces();

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
    const allPlaces = await this.findAllPlaces();
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
