import { Injectable } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import { JsonDb } from '../jsondb.js';

@Injectable()
export class PlacesService {
  private readonly jdb: JsonDb = new JsonDb('places');

  async create(dto: CreatePlaceDto) {
    const currentData = await this.jdb.readData(); // get the data

    currentData.push(dto); // add the new data

    await this.jdb.writeData(currentData); // save the new data

    return { message: 'Item saved successfully!', data: dto };
  }

  findAll() {
    return `This action returns all places`;
  }

  findOne(id: number) {
    return `This action returns a #${id} place`;
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    return `This action updates a #${id} place`;
  }

  remove(id: number) {
    return `This action removes a #${id} place`;
  }
}
