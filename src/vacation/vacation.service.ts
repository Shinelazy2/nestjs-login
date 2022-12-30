import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateVacationDTO } from './dtos/create-vacation.dto';
import { Vacation } from './entity/vacation.entity';

@Injectable()
export class VacationService {
  constructor(@InjectRepository(Vacation) private vacationRepository: Repository<Vacation>) {}

  /**
   * 휴가 등록
   * @param dto
   * @returns
   */
  async registerVacation(dto: CreateVacationDTO) {
    return await this.vacationRepository.save(dto);
  }

  // async update(text: unknown, options: unknown) {
  //   return this.vacationRepository
  //     .createQueryBuilder()
  //     .update(Vacation)
  //     .set({ joinUserId: dto.joinUserId })
  //     .where('joinUserId = :joinUserId', { joinUserId: dto.joinUserId })
  //     .execute();
  //   return await this.vacationRepository.update(options, text);
  // }

  /**
   *
   * @param CreateVacationDTO
   * @returns
   */
  async save(dto: CreateVacationDTO): Promise<Vacation | undefined | any> {
    return await this.vacationRepository.save(dto);
  }

  async findByFilds(options: FindOneOptions<Vacation>): Promise<Vacation | undefined> {
    return await this.vacationRepository.findOne(options);
  }
}
