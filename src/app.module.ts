import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ThrottlerModule} from "@nestjs/throttler";
import {PrometheusModule} from "@willsoto/nestjs-prometheus";


@Module({
  imports: [
      PrometheusModule.register(),
      ThrottlerModule.forRoot([{
        ttl:60000,
        limit:10
      }]),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
