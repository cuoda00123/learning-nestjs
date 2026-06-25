import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import type { Express } from 'express';
import { UploadsToAwsProvider } from './uploads-to-aws.provider';
import { Repository } from 'typeorm';
import { Upload } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { fileTypes } from '../enums/file-types.enum';
import { UploadFile } from '../../interfaces/upload-file.interface';
@Injectable()
export class UploadsService {
  constructor(
    //inject uploads file provider
    private readonly uploadsToAwsProvider: UploadsToAwsProvider,

    //inject uploads repository
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,

    //inject config service
    private readonly configService: ConfigService,
  ) {}
  public async uploadFile(file: Express.Multer.File) {
    // Throw error on unsupported file type
    if (!['image/gif', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
      throw new BadRequestException('Unsupported file type');
    }
    try {
      //upload file to aws s3
      const name = await this.uploadsToAwsProvider.fileUpload(file);
      //generate to a new entry in a db
      const uploadFile: UploadFile = {
        name: name,
        path: `https://${this.configService.get('appConfig.awsCloudfrontUrl')}/${name}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      const upload = this.uploadRepository.create(uploadFile);
      return await this.uploadRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
