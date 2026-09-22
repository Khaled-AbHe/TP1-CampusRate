import { CreatePlaceDto } from '../dto/create-place.dto.js';
import { randomStringGenerator } from '@nestjs/common/internal';

export class Place {
  id!: string;
  name!: string;
  description!: string;
  category!: string;
  address!: string;
  services?: string[]; // string[] est temporaire
  status?: string; // temporaire
  averageRating: number | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(dto: CreatePlaceDto) {
    this.id = 'plc_' + randomStringGenerator(); // temporaire
    this.name = dto.name;
    this.description = dto.description;
    this.category = dto.category;
    this.address = dto.address;
    this.services = dto.services;
    this.status = dto.status;
    this.averageRating;
    this.reviewCount = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
