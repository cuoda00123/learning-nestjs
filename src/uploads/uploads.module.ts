import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadsService } from './provider/uploads.service';
import { UploadsToAwsProvider } from './provider/uploads-to-aws.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';

@Module({
  controllers: [UploadController],
  providers: [UploadsService, UploadsToAwsProvider],
  imports: [TypeOrmModule.forFeature([Upload])],
})
export class UploadsModule {}
