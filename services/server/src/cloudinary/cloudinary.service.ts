import { Injectable, Logger } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';
import { Readable } from 'node:stream';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) {
          this.logger.error(`Cannot upload image to Cloudinary ${error}`);
          return reject(error);
        }
        return resolve(result);
      });
      Readable.from(file.buffer).pipe(upload);
    });
  }
}
