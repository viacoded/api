import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from "node:path";

@Controller({path:"main", version:"1"})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("deneme")
  getDeneme(): string {
    return this.appService.getDeneme();
  }
}
