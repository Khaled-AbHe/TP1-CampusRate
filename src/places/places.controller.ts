import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
import { PlacesService } from './places.service.js';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import { Place } from './entities/place.entity.js';
import { RemovePlaceResponseDto } from './dto/responses/remove-place-response.dto.js';
import { CreatePlaceResponseDto } from './dto/responses/create-place-response.dto.js';
import { UpdatePlaceResponseDto } from './dto/responses/update-place-response.dto.js';
import { PlacesPageOptionsDto } from '../common/dto/pagination/places-page-options.dto.js';

@ApiTags('Places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un nouveau endroit évalué',
    description: 'Ajoute un nouveau lieu évaluable sur le campus.',
  })
  @ApiCreatedResponse({
    description: "L'endroit a été créé avec succès.",
    type: CreatePlaceResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Les données envoyées sont invalides.',
  })
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.createPlace(createPlaceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister tous les endroits',
    description: 'Retourne la liste complète des endroits du campus.',
  })
  @ApiOkResponse({
    description: 'Liste des endroits récupérée avec succès.',
    type: [Place],
  })
  findAllPlaces(@Query() dto: PlacesPageOptionsDto) {
    return this.placesService.findAllPlaces(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un endroit par son identifiant',
  })
  @ApiParam({
    name: 'id',
    description:
      "Identifiant unique d'un endroit. (plc_01J[3 caractères majusticule][3 chiffres])",
    example: 'plc_01JABC123',
  })
  @ApiOkResponse({
    description: "L'endroit a été trouvé.",
    type: Place,
  })
  @ApiNotFoundResponse({
    description: "Aucun endroit ne correspond à l'identifiant fourni.",
  })
  findOnePlaceById(@Param('id') id: string) {
    return this.placesService.findOnePlaceById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Mettre à jour un endroit',
    description:
      "Met à jour partiellement les informations d'un endroit existant.",
  })
  @ApiParam({
    name: 'id',
    description:
      "Identifiant unique d'un endroit. (plc_01J[3 caractères majusticule][3 chiffres])",
    example: 'plc_01JABC123',
  })
  @ApiOkResponse({
    description: "L'endroit a été mis à jour avec succès.",
    type: UpdatePlaceResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Les données envoyées sont invalides.',
  })
  @ApiNotFoundResponse({
    description: "Aucun endroit ne correspond à l'identifiant fourni.",
  })
  update(@Param('id') id: string, @Body() dto: UpdatePlaceDto) {
    return this.placesService.updatePlaceById(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer un endroit',
  })
  @ApiParam({
    name: 'id',
    description:
      "Identifiant unique d'un endroit. (plc_01J[3 caractères majusticule][3 chiffres])",
    example: 'plc_01JABC123',
  })
  @ApiOkResponse({
    description: "L'endroit a été supprimé avec succès.",
    type: RemovePlaceResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Aucun endroit ne correspond à l'identifiant fourni.",
  })
  remove(@Param('id') id: string) {
    return this.placesService.removePlaceById(id);
  }
}
