import { Module } from '@nestjs/common';
import { PlacesModule } from './places/places.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi = require('joi');
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import databaseConfig from './configs/database.config.js';

@Module({
  imports: [
    AuthModule,
    PlacesModule,
    ReviewsModule,

    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        autoIndex: configService.get<string>('NODE_ENV') !== 'prod', // Désactive l'auto-indexation en prod pour les performances
      }),
    }),

    UserModule,
  ],
})
export class AppModule {}
