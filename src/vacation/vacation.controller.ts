import { VacationService } from './vacation.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateVacationDTO } from './dtos/create-vacation.dto';

@Controller('vacation')
export class VacationController {
  constructor(private vacationService: VacationService) {}

  /**
   * 휴가 등록
   */
  @Post('/register')
  async registerVacation(@Body() dto: CreateVacationDTO) {
    return await this.vacationService.registerVacation(dto);
  }
}
