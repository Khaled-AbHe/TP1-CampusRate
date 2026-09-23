import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from './page-options.dto.js';

export class PageDataDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly totalItems: number;

  @ApiProperty()
  readonly totalPages: number;

  constructor(pageOptionsDto: PageOptionsDto, itemCount: number) {
    this.page = pageOptionsDto.page ?? 1;
    this.limit = pageOptionsDto.limit ?? 10;
    this.totalItems = itemCount;
  }
}
