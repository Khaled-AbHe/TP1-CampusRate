import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { Review } from './entities/review.entity.js';
import { CreateReviewResponseDto } from './dto/responses/create-review-response.dto.js';
import { UpdateReviewResponseDto } from './dto/responses/update-review-response.dto.js';
import { RemoveReviewResponseDto } from './dto/responses/remove-review-response.dto.js';

@ApiTags('Appréciations')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer une nouvelle appréciation',
    description: 'Ajoute une nouvelle appréciation pour un endroit du campus.',
  })
  @ApiCreatedResponse({
    description: "L'appréciation a été créée avec succès.",
    type: CreateReviewResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Les données envoyées sont invalides.',
  })
  create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.createReview(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister toutes les appréciations',
    description: 'Retourne la liste complète des appréciations.',
  })
  @ApiOkResponse({
    description: 'Liste des appréciations récupérée avec succès.',
    type: [Review],
  })
  findAll() {
    return this.reviewsService.findAllReviews();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer une appréciation par son identifiant',
  })
  @ApiParam({
    name: 'id',
    description:
      "Identifiant unique d'une appréciation. (rev_01J[3 caractères majusticule][3 chiffres])",
    example: 'rev_01JABC123',
  })
  @ApiOkResponse({
    description: "L'appréciation a été trouvée.",
    type: Review,
  })
  @ApiNotFoundResponse({
    description: "Aucune appréciation ne correspond à l'identifiant fourni.",
  })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOneReviewById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Mettre à jour une appréciation',
    description:
      "Met à jour partiellement les informations d'une appréciation existante.",
  })
  @ApiParam({
    name: 'id',
    description:
      "Identifiant unique d'une appréciation. (rev_01J[3 caractères majusticule][3 chiffres])",
    example: 'rev_01JABC123',
  })
  @ApiOkResponse({
    description: "L'appréciation a été mise à jour avec succès.",
    type: UpdateReviewResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Les données envoyées sont invalides.',
  })
  @ApiNotFoundResponse({
    description: "Aucune appréciation ne correspond à l'identifiant fourni.",
  })
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.updateReviewById(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer une appréciation',
  })
  @ApiParam({
    name: 'id',
    description:
      "Identifiant unique d'une appréciation. (rev_01J[3 caractères majusticule][3 chiffres])",
    example: 'rev_01JABC123',
  })
  @ApiOkResponse({
    description: "L'appréciation a été supprimée avec succès.",
    type: RemoveReviewResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Aucune appréciation ne correspond à l'identifiant fourni.",
  })
  remove(@Param('id') id: string) {
    return this.reviewsService.removeReviewById(id);
  }
}
