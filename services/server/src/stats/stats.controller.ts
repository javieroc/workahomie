import { Controller, Get, Header } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=300')
  getStats() {
    return this.statsService.getStats();
  }
}
