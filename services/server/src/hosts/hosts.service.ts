import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FindAllResponse } from 'src/dto/response.dto';
import { CreateHostDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';
import { Host, HostDocument } from './schemas/host.schema';
import { UpdateHostPlaceDto } from './dto/update-host-place.dto';
import { SearchParamsDto } from './dto/search-params.dto';

@Injectable()
export class HostsService {
  constructor(
    @InjectModel(Host.name) private HostModel: Model<HostDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createHostDto: CreateHostDto & { userId: string },
    profile?: Express.Multer.File,
  ): Promise<Host> {
    const host = new this.HostModel(createHostDto);

    if (profile) {
      const image = await this.cloudinaryService.uploadImage(profile, `profile_${host.userId}`);
      host.profileImages = [image.secure_url];
    }

    return host.save();
  }

  async findAll({
    limit = 10,
    offset = 0,
    lat,
    lng,
  }: SearchParamsDto): Promise<FindAllResponse<Host>> {
    const total = await this.HostModel.find({
      ...(lat && lng
        ? {
            location: {
              $near: {
                $geometry: {
                  type: 'Point',
                  coordinates: [lng, lat],
                },
                $maxDistance: 10000,
              },
            },
          }
        : {}),
    }).exec();
    const data = await this.HostModel.find({
      ...(lat && lng
        ? {
            location: {
              $near: {
                $geometry: {
                  type: 'Point',
                  coordinates: [lng, lat],
                },
                $maxDistance: 10000,
              },
            },
          }
        : {}),
    })
      .limit(limit)
      .skip(offset)
      .exec();

    return {
      data,
      total: total.length,
    };
  }

  async findOne(id: string): Promise<Host> {
    const host = await this.HostModel.findById(id);
    if (!host) {
      throw new NotFoundException('Host not found!');
    }
    return host;
  }

  async findMe(userId: string): Promise<Host> {
    return this.HostModel.findOne({ userId });
  }

  async update(
    { userId, ...updateHostDto }: UpdateHostDto & { userId: string },
    profile?: Express.Multer.File,
  ): Promise<Host> {
    const host = await this.HostModel.findOneAndUpdate({ userId }, updateHostDto, {
      new: true,
    }).exec();

    if (profile) {
      const image = await this.cloudinaryService.uploadImage(profile, `profile_${host.userId}`);
      host.profileImages = [image.secure_url];
      await host.save();
    }

    return host;
  }

  async updatePlace(
    { userId, ...updateHostPlaceDto }: UpdateHostPlaceDto & { userId: string },
    pictures?: Array<Express.Multer.File>,
  ): Promise<Host> {
    const addressObj = JSON.parse(updateHostPlaceDto.address);

    const location = {
      type: 'Point',
      coordinates: [Number.parseFloat(addressObj.lat), Number.parseFloat(addressObj.lon)],
    };

    const host = await this.HostModel.findOneAndUpdate(
      { userId },
      { ...updateHostPlaceDto, location },
      {
        new: true,
      },
    ).exec();

    if (pictures.length) {
      const promises = pictures.map((picture) =>
        this.cloudinaryService.uploadImage(picture, `place_${picture.originalname}`),
      );
      const images = await Promise.all(promises);
      const pictureUrls = images.map((image) => image.secure_url);
      host.pictures = [...host.pictures, ...pictureUrls];
      await host.save();
    }

    return host;
  }

  async remove(id: string) {
    const host = await this.HostModel.findByIdAndDelete(id);
    if (!host) {
      throw new NotFoundException('Host not found!');
    }
    return host;
  }
}
