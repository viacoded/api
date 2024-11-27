import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Loopback proxy'lerine güven
    app.set("trust proxy", "loopback");

    // Versiyonlamayı URI üzerinden etkinleştir
    app.enableVersioning({
      type: VersioningType.URI,
    });

    // CORS'u etkinleştir
    app.enableCors({
      origin: true,
      credentials: true,
    });

    // Uygulamayı 3000 portunda başlat
    await app.listen(3000, '0.0.0.0');

  } catch (error) {
    console.error('Uygulama başlatılırken hata oluştu:', error);
  }
}

bootstrap();
