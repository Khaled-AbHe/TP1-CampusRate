import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { JsonDb } from '../jsondb.js';

@Injectable()
export class ReviewsService {
  private readonly jdb: JsonDb = new JsonDb('reviews');

  async create(dto: CreateReviewDto) {
    const currentData = await this.jdb.readData(); // get the data

    currentData.push(dto); // add the new data

    await this.jdb.writeData(currentData); // save the new data

    return { message: 'Item saved successfully!', data: dto };
  }

  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
