import { Logger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  try {
    await CommandFactory.run(AppModule, logger);

    await CommandFactory.run(AppModule, ['warn', 'error']);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err);
    }
  } finally {
    process.exit(0);
  }
}

bootstrap();
