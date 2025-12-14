import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggingService } from './common/services/logging.service';
import * as dotenv from 'dotenv';

dotenv.config();

// Setup uncaught exception handler
process.on('uncaughtException', (error: Error) => {
  const loggingService = new LoggingService();
  loggingService.error(
    `Uncaught Exception: ${error.message}`,
    error.stack,
    'UncaughtException',
  );
  process.exit(1);
});

// Setup unhandled rejection handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
process.on('unhandledRejection', (reason: any, _promise: Promise<any>) => {
  const loggingService = new LoggingService();
  const errorMessage =
    reason instanceof Error ? reason.message : String(reason);
  const errorStack = reason instanceof Error ? reason.stack : undefined;
  loggingService.error(
    `Unhandled Rejection: ${errorMessage}`,
    errorStack,
    'UnhandledRejection',
  );
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get LoggingService instance
  const loggingService = app.get(LoggingService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);

  loggingService.log(`Application is running on port ${port}`, 'Bootstrap');
}
bootstrap();
