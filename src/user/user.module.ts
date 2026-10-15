import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './user.service.js';
import { UsersController } from './user.controller.js';
import { UserType } from './enum/user-type.enum.js';
import { User, UserSchema } from './models/user.schema.js';
import { Admin, AdminSchema } from './models/admin.model.js';
import { Student, StudentSchema } from './models/student.model.js';

/**
 * Sources:
 *  - https://docs.nestjs.com/data/mongodb#discriminators
 *  - https://medium.com/@sepehr.gouran/using-mongoose-discriminators-in-nest-js-7b715eee76eb
 */
@Module({
  imports: [
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
  controllers: [UsersController],
  providers: [UsersService],
})
export class UserModule {}
