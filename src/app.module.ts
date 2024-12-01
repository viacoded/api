import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ThrottlerModule} from "@nestjs/throttler";
import {PrometheusModule} from "@willsoto/nestjs-prometheus";
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { AuthModule } from './auth/auth.module';
import {UserService} from "./user/user.service";
import {PrismaService} from "./prisma.service";


@Module({
  imports: [
      PrometheusModule.register(),
      ThrottlerModule.forRoot([{
        ttl:60000,
        limit:10
      }]),
      UserModule,
      RoleModule,
      PermissionModule,
      AuthModule,

  ],
  controllers: [AppController],
  providers: [AppService,PrismaService]
})
export class AppModule {}
