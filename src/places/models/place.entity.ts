import RandExp from 'randexp';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePlaceDto } from '../dto/create-place.dto.js';
import { Category } from '../enums/category.enum.js';
import { Status } from '../enums/status.enum.js';

export class Place {
  @ApiProperty({
    description:
      "Identifiant unique de l'endroit. (plc_01J[3 caractères majusticule][3 chiffres])",
    example: 'plc_01JABC123',
  })
  id!: string;

  @ApiProperty({
    description: "Nom de l'endroit",
    example: 'Bibliothèque centrale',
  })
  name!: string;

  @ApiProperty({
    description: "Description de l'endroit",
    example: 'Grand espace de lecture calme avec prises électriques',
  })
  description!: string;

  @ApiProperty({
    description: "Catégorie de l'endroit",
    enum: Category,
    example: Category.LIBRARY,
  })
  category!: Category;

  @ApiProperty({
    description: "Adresse ou localisation de l'endroit sur le campus",
    example: 'Pavillon A, 2e étage',
  })
  address!: string;

  @ApiProperty({
    description: 'Services disponibles sur place',
    type: [String],
    required: false,
    example: ['Wi-Fi', 'Prises électriques'],
  })
  services?: string[];

  @ApiProperty({
    description: "Statut actuel de l'endroit",
    enum: Status,
    required: false,
    example: Status.ACTIVE,
  })
  status?: Status;

  @ApiProperty({
    description:
      'Note moyenne calculée à partir des avis, ou null si aucun avis',
    example: 4.5,
    nullable: true,
  })
  averageRating: number | null;

  @ApiProperty({
    description: "Nombre total d'avis associés à l'endroit",
    example: 12,
  })
  reviewCount: number;

  @ApiProperty({
    description: "Date de création l'endroit",
    example: '2026-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: "Date de dernière modification de l'endroit",
    example: '2026-02-01T08:00:00.000Z',
  })
  updatedAt: Date;

  constructor(dto: CreatePlaceDto) {
    this.id = new RandExp(/^plc_01J[A-Z]{3}\d{3}$/).gen();
    this.name = dto.name;
    this.description = dto.description;
    this.category = dto.category;
    this.address = dto.address;
    this.services = dto.services;
    this.status = dto.status;
    this.averageRating = null;
    this.reviewCount = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
