import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { type Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dtos/login.dto.js';
import { LoginResponseDto } from './dtos/login-response.dto.js';
import { ProfileResponseDto } from './dtos/profile-response.dto.js';
import { ProblemDetailsDto } from '../../common/problemDetails/dto/problem-details.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: "S'authentifier",
    description: 'Valide les identifiants et retourne un jeton JWT.',
  })
  @ApiCreatedResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse({ type: ProblemDetailsDto })
  @ApiUnauthorizedResponse({
    description: "Nom d'utilisateur ou mot de passe invalide",
    type: ProblemDetailsDto,
  })
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiOperation({
    summary: "Obtenir le profil de l'utilisateur authentifié",
  })
  @ApiOkResponse({ type: ProfileResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Jeton manquant, invalide ou expiré',
    type: ProblemDetailsDto,
  })
  @ApiBearerAuth()
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }
}
