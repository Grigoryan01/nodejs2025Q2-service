import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InMemoryStorageService } from '../common/services/in-memory-storage.service';
import { User } from '../entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly storage: InMemoryStorageService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ id: string; login: string }> {
    if (!signupDto.login || !signupDto.password) {
      throw new BadRequestException('Login and password are required');
    }

    if (
      typeof signupDto.login !== 'string' ||
      typeof signupDto.password !== 'string'
    ) {
      throw new BadRequestException('Login and password must be strings');
    }

    // Check if user already exists
    const existingUsers = this.storage.getAllUsers();
    const existingUser = existingUsers.find((u) => u.login === signupDto.login);
    if (existingUser) {
      throw new BadRequestException('User with this login already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const now = Date.now();
    const user: User = {
      id: randomUUID(),
      login: signupDto.login,
      password: hashedPassword,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    const created = this.storage.createUser(user);
    return {
      id: created.id,
      login: created.login,
    };
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    if (!loginDto.login || !loginDto.password) {
      throw new BadRequestException('Login and password are required');
    }

    if (
      typeof loginDto.login !== 'string' ||
      typeof loginDto.password !== 'string'
    ) {
      throw new BadRequestException('Login and password must be strings');
    }

    const users = this.storage.getAllUsers();
    const user = users.find((u) => u.login === loginDto.login);

    if (!user) {
      throw new ForbiddenException('Authentication failed');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Authentication failed');
    }

    return this.generateTokens(user);
  }

  async refresh(refreshDto: RefreshDto): Promise<TokenResponseDto> {
    if (!refreshDto.refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const payload = this.jwtService.verify(refreshDto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = this.storage.getUserById(payload.userId);
      if (!user) {
        throw new ForbiddenException('Authentication failed');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new ForbiddenException('Authentication failed');
    }
  }

  private generateTokens(user: User): TokenResponseDto {
    const payload = {
      userId: user.id,
      login: user.login,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.storage.getUserById(userId) || null;
  }
}
