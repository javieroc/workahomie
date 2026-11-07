import helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsOrigin, getAllowedOrigins } from './common/cors';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  if (!getAllowedOrigins()) {
    logger.warn('CORS_ORIGINS is not set: allowing requests from any origin');
  }
  app.enableCors({ origin: corsOrigin });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 8000);
  await app.listen(port);
  logger.log(`Server listening on port ${port}`);
}
bootstrap();
