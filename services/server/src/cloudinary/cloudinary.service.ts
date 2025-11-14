import { Injectable, Logger } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';
import { Readable } from 'node:stream';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  async uploadImage(
    file: Express.Multer.File,
    image_id: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          public_id: image_id,
          overwrite: true,
          folder: process.env.CLOUDINARY_FOLDER ?? 'workahomie',
        },
        (error, result) => {
          if (error) {
            this.logger.error(`Cannot upload image to Cloudinary ${error}`);
            return reject(error);
          }
          return resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(upload);
    });
  }

  async deleteImage(imagePath: string): Promise<void> {
    try {
      const publicId = this.extractPublicId(imagePath);

      if (!publicId) {
        this.logger.warn(`Could not extract Cloudinary public_id from: ${imagePath}`);
        return;
      }

      await v2.uploader.destroy(publicId);
      this.logger.log(`Deleted Cloudinary image: ${publicId}`);
    } catch (error) {
      this.logger.error(`Cannot delete Cloudinary image: ${error}`);
    }
  }

  private extractPublicId(path: string): string {
    // If already looks like a public_id (no http, no extension)
    if (!path.startsWith('http')) {
      return path;
    }

    try {
      // Remove query parameters if present
      const cleanUrl = path.split('?')[0];

      // Get the part after /upload/
      const parts = cleanUrl.split('/upload/');

      if (parts.length < 2) return '';

      // Extract everything after /upload/
      const publicPath = parts[1];

      // Remove the file extension (.jpg, .png, etc)
      const withoutExtension = publicPath.replace(/\.[^/.]+$/, '');

      return withoutExtension;
    } catch {
      return '';
    }
  }
}
