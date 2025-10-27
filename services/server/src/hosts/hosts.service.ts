import { Model, RootFilterQuery } from 'mongoose';
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
    occupations,
    facilities,
    rate,
  }: SearchParamsDto): Promise<FindAllResponse<Host>> {
    const findFilter: RootFilterQuery<Host> = {};
    const countFilter: RootFilterQuery<Host> = {};

    if (lat && lng) {
      findFilter.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: 10000,
        },
      };
      countFilter.location = {
        $geoWithin: {
          $centerSphere: [[lng, lat], 10000 / 6378100],
        },
      };
    }

    if (occupations) {
      findFilter.occupation = { $in: occupations };
      countFilter.occupation = { $in: occupations };
    }

    if (facilities) {
      findFilter.facilities = { $all: facilities };
      countFilter.facilities = { $all: facilities };
    }

    if (rate) {
      findFilter.rate = { $gte: rate };
      countFilter.rate = { $gte: rate };
    }

    const total = await this.HostModel.countDocuments(countFilter).exec();
    const data = await this.HostModel.find(findFilter).limit(limit).skip(offset).lean();

    return {
      data,
      total,
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
      coordinates: [Number.parseFloat(addressObj.lon), Number.parseFloat(addressObj.lat)],
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
