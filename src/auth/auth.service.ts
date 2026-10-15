import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../user/user.service.js';
import { User } from '../user/models/user.schema.js';
import { Payload } from './model/payload.model.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // Valider un utilisateur
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Invalid password');

    return user;
  }

  // Générer un JWT
  async login(user: User) {
    const payload: Payload = {
      sub: user._id,
      username: user.username,
      role: user.userType,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
