import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
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
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
