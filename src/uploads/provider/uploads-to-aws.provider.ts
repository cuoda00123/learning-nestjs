import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class UploadsToAwsProvider {
  constructor(
    // inject config service
    private readonly configService: ConfigService,
  ) {}

  public async fileUpload(file: Express.Multer.File) {
    const s3 = new S3();

    try {
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get<string>('appConfig.awsBucketName')!,
          Key: this.generateFileName(file),
          Body: file.buffer,
          ContentType: file.mimetype,
        })
        .promise();

      return uploadResult.Key;
    } catch (error) {
      throw new RequestTimeoutException('Something went wrong, please try again later', {
        description: `Error in uploading file to server, and error is ${error}`,
      });
    }
  }

  private generateFileName(file: Express.Multer.File) {
    //extract file name
    let name = file.originalname.split('.')[0];
    //remove white spaces
    name = name.replace(/\s/g, '').trim();
    //extract file extension
    let extension = path.extname(file.originalname);
    //generate time stamp
    let timestamp = new Date().getTime().toString().trim();
    //return file uuid
    return `${name}-${timestamp}-${uuidv4()}${extension}`;
  }
}
