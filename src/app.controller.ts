import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //@는 decorator @Get() === @Get("/")
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
