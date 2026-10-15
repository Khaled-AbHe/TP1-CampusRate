import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Simuler une base de données d'utilisateurs
  private users = [
    { id: 1, username: 'user1', password: bcrypt.hash('password1', 10) },
    { id: 2, username: 'user2', password: bcrypt.hash('password2', 10) },
  ];

  // Valider un utilisateur
  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find((u) => u.username === username);
    
    if (user && (await bcrypt.compare(password, await user.password))) {
      const { password, ...result } = user;
      return result; // Retourne l'utilisateur sans le mot de passe
    }
    throw new UnauthorizedException(
      "Nom d'utilisateur ou mot de passe invalide",
    );
  }

  // Générer un JWT
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
