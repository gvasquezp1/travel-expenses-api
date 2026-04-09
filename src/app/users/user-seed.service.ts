import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UserSeedService.name);

  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const email = 'admin@marpico.com';

    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) return;

    const passwordHash = await bcrypt.hash('Admin123', 10);

    const admin = this.usersRepo.create({
      name: 'Administrador',
      email,
      phoneNumber: '',
      lineId: '',
      roleId: '',
      isSystemAdmin: true,
      locked: false,
      passwordHash,
    });

    await this.usersRepo.save(admin);
    this.logger.log(`Usuario administrador creado: ${email}`);
  }
}
