import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appCreate } from './app.create';
//import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // adding middleware
  appCreate(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
