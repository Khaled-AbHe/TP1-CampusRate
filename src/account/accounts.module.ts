import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/auth.controller.js';
import { AuthService } from './auth/auth.service.js';
import { JwtStrategy } from './auth/jwt.strategy.js';
import { UserType } from './user/enum/user-type.enum.js';
import { Admin, AdminSchema } from './user/models/admin.model.js';
import { Student, StudentSchema } from './user/models/student.model.js';
import { User, UserSchema } from './user/models/user.schema.js';
import { UsersController } from './user/user.controller.js';
import { UsersService } from './user/user.service.js';
/**
 * Sources:
 *  - https://docs.nestjs.com/data/mongodb#discriminators
 *  - https://medium.com/@sepehr.gouran/using-mongoose-discriminators-in-nest-js-7b715eee76eb
 */
@Module({
  imports: [
    PassportModule,

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [
          {
            name: Admin.name,
            schema: AdminSchema,
            value: UserType.ADMIN,
          },
          {
            name: Student.name,
            schema: StudentSchema,
            value: UserType.ETUDIANT,
          },
        ],
      },
    ]),
  ],
  providers: [AuthService, JwtStrategy, UsersService],
  controllers: [AuthController, UsersController],
})
export class AccountsModule {}
