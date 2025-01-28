import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health-check')
  @ApiOperation({ summary: 'Get server health status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Server health check status recieved',
  })
  getHealthCheck(): { message: string } {
    console.log('health check API called');
    return this.appService.getHealthCheck();
  }
}
