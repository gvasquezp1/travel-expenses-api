import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}
  
  async create(createUserDto: CreateUserDto) {
    const existing = await this.usersRepo.findOne({ where : { email: createUserDto.email }});
    if (existing) throw new BadRequestException('Email ya está registrado');

    const passwordHash = await bcrypt.hash(createUserDto.password, 12);

    const user = this.usersRepo.create({
      name : createUserDto.name,
      email : createUserDto.email, 
      costCenter : createUserDto.costCenter, 
      phoneNumber : createUserDto.phoneNumber, 
      role : createUserDto.role, 
      passwordHash, 

    });

    const saved = await this.usersRepo.save(user);

    const { passwordHash: _, ...safe } = saved;
    return safe;

  }

  findAll() {
    return this.usersRepo.find();
  }

  async findOne(id: string) {
    return await this.usersRepo.findOne({ where : { id : id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepo.update(id, updateUserDto);
  }

  async remove(id: string) {
    const user = await this.usersRepo.findOne({where :{ id : id }});
    if( !user ){
      throw new NotFoundException('Usuario no encontrado');
    }
      
    this.usersRepo.remove(user);

    return { message: 'Usuario eliminado correctamente' };
  }
}
