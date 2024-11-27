import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getDeneme(): string {
    return "deneme sayfasi"
  }
}
