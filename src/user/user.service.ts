import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InMemoryStorageService } from '../common/services/in-memory-storage.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly storage: InMemoryStorageService) {}

  findAll(): Omit<User, 'password'>[] {
    return (
      this.storage
        .getAllUsers()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ password: _password, ...user }) => user)
    );
  }

  findOne(id: string): Omit<User, 'password'> {
    const user = this.storage.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const now = Date.now();
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: hashedPassword,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    const created = this.storage.createUser(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = created;
    return userWithoutPassword;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Omit<User, 'password'>> {
    const user = this.storage.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Old password is wrong');
    }

    // Hash new password before storing
    const hashedNewPassword = await bcrypt.hash(
      updatePasswordDto.newPassword,
      10,
    );

    const updated = this.storage.updateUser(id, {
      password: hashedNewPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    });

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  remove(id: string): void {
    const deleted = this.storage.deleteUser(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
  }
}
