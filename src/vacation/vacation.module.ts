import { Vacation } from 'src/vacation/entity/vacation.entity';
import { Module } from '@nestjs/common';
import { VacationController } from './vacation.controller';
import { VacationService } from './vacation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/auth/user.service';
import { User } from 'src/auth/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vacation, User])],
  controllers: [VacationController],
  providers: [VacationService, UserService],
})
export class VacationModule {}
