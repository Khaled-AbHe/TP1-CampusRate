import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { StorageService } from '../storage.service.js';

@Injectable()
export class ReviewsService {
  constructor(private readonly storageService: StorageService) {}

  async create(dto: CreateReviewDto) {
    const currentData = await this.storageService.readData(); // get the data

    currentData.reviews.push(dto); // add the new data

    await this.storageService.writeData(currentData); // save the new data

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
