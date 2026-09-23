import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from './page-options.dto.js';

export class PaginationDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly totalItems: number;

  @ApiProperty()
  readonly totalPages: number;

  constructor(pageOptionsDto: PageOptionsDto, itemCount: number) {
    this.page = pageOptionsDto.page;
    this.limit = pageOptionsDto.limit;
    this.totalItems = itemCount;
  }
}
