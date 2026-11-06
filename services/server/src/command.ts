import { Logger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { CommandsModule } from './commands.module';

async function bootstrap() {
  const logger = new Logger('Command');
  try {
    await CommandFactory.run(CommandsModule, logger);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err);
    }
    process.exitCode = 1;
  } finally {
    process.exit();
  }
}

bootstrap();
