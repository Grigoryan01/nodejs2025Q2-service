import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InMemoryStorageService } from '../common/services/in-memory-storage.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(private readonly storage: InMemoryStorageService) {}

  findAll(): Omit<User, 'password'>[] {
    return this.storage.getAllUsers().map(({ password, ...user }) => user);
  }

  findOne(id: string): Omit<User, 'password'> {
    const user = this.storage.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    const now = Date.now();
    const user: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    const created = this.storage.createUser(user);
    const { password, ...userWithoutPassword } = created;
    return userWithoutPassword;
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Omit<User, 'password'> {
    const user = this.storage.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    const updated = this.storage.updateUser(id, {
      password: updatePasswordDto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    });

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  remove(id: string): void {
    const deleted = this.storage.deleteUser(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
  }
}

