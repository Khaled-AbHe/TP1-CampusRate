import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserType } from './enum/user-type.enum.js';
import { Admin } from './models/admin.model.js';
import { Student } from './models/student.model.js';
import { User } from './models/user.schema.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const model =
      dto.userType === UserType.ADMIN ? this.adminModel : this.studentModel;

    const user = await model.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    });
    return { message: 'User created successfully!', data: user };
  }

  async findAllUsers() {
    return this.userModel.find().exec();
  }

  async findOneUserById(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) throw new NotFoundException('User doesnt exist');

    return user;
  }

  async updateUserById(id: string, dto: UpdateUserDto) {
    const changes = { ...dto };
    if (changes.password) {
      changes.password = await bcrypt.hash(changes.password, 10);
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, changes, { returnDocument: 'after' })
      .exec();

    if (!user) throw new NotFoundException('User doesnt exist');

    return { message: 'User updated successfully!', data: user };
  }

  async removeUserById(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();

    if (!user) throw new NotFoundException('User doesnt exist');

    return { message: 'User removed successfully!', removed_user: user };
  }

  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) throw new NotFoundException('User doesnt exist');

    return user;
  }
}
