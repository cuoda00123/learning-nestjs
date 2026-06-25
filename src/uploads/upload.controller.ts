import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeaders, ApiOperation } from '@nestjs/swagger';
import type { Express } from 'express';
import { UploadsService } from './provider/uploads.service';
@Controller('uploads')
export class UploadController {
  constructor(
    // inject upload service
    private readonly uploadService: UploadsService,
  ) {}
  @UseInterceptors(FileInterceptor('file'))
  @ApiHeaders([
    { name: 'Content-Type', description: 'multipart/form-data', required: true },
    { name: 'Authorization', description: 'Bearer token', required: true },
  ])
  @ApiOperation({
    summary: 'Uplload a file to server',
  })
  @Post('file')
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }
}
