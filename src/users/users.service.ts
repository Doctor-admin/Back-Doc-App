import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}
  async create(createUserDto: CreateUserDto): Promise<Users> {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const createdUser = new this.usersModel({
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
