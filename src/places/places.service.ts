import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import { JsonDb } from '../jsondb.js';
import { Place } from './entities/place.entity.js';

@Injectable()
export class PlacesService {
  private readonly jdb: JsonDb = new JsonDb('places');

  async create(dto: CreatePlaceDto) {
    const allPlaces = await this.findAll();
    const place = new Place(dto);
    allPlaces.push(place);
    await this.jdb.writeData(allPlaces);

    return { message: 'Place created successfully!', data: place };
  }

  async findAll(): Promise<Place[]> {
    return await this.jdb.readData();
  }

  async findOne(id: string) {
    const place = (await this.findAll()).find((place) => place.id === id);

    if (!place) throw new NotFoundException('Place doesnt exist');

    return place;
  }

  async update(id: string, dto: UpdatePlaceDto) {
    const allPlaces = await this.findAll();

    const updatedPlaces = allPlaces.map((place) =>
      place.id === id ? { ...place, ...dto, updatedAt: new Date() } : place,
    );

    await this.jdb.writeData(updatedPlaces);

    return {
      message: 'Place updated successfully!',
      data: await this.findOne(id),
    };
  }

  async remove(id: string) {
    const allPlaces = await this.findAll();
    const targetPlace = await this.findOne(id);

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
