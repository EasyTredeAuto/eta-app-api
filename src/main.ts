import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import env from './utils/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  app.enableCors()
  
  // Swagger
  const options = new DocumentBuilder()
    .setTitle('AUTO TREAD PROJECT')
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api-doc', app, document)

  await app.listen(configService.get(env.PORT) || 3000)
}
bootstrap();
