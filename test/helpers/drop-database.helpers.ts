import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export async function dropDatabase(configService: ConfigService): Promise<void> {
  const AppDataSource = new DataSource({
    type: 'postgres',
    synchronize: configService.get<boolean>('database.synchronize'),
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.user'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.name'),
  });

  // Connect to the database
  await AppDataSource.initialize();

  // Drop all tables
  await AppDataSource.dropDatabase();

  // Close the connection
  await AppDataSource.destroy();
}
