import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateHostDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';
import { Host, HostDocument } from './schemas/host.schema';
import { UpdateHostPlaceDto } from './dto/update-host-place.dto';
import { Place, PlaceDocument } from './schemas/place.schema';

@Injectable()
export class HostsService {
  constructor(
    @InjectModel(Host.name) private HostModel: Model<HostDocument>,
    @InjectModel(Place.name) private PlaceModel: Model<PlaceDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createHostDto: CreateHostDto & { userId: string },
    profile?: Express.Multer.File,
  ): Promise<Host> {
    const host = new this.HostModel(createHostDto);

    const place = new this.PlaceModel();
    await place.save();
    host.place = place;

    if (profile) {
      const image = await this.cloudinaryService.uploadImage(profile, `profile_${host.userId}`);
      host.profileImages = [image.secure_url];
    }

    return host.save();
  }

  findAll(): Promise<Host[]> {
    return this.HostModel.find().populate('place').exec();
  }

  async findOne(id: string): Promise<Host> {
    const host = await this.HostModel.findById(id).populate('place');
    if (!host) {
      throw new NotFoundException('Host not found!');
    }
    return host;
  }

  async findMe(userId: string): Promise<Host> {
    return this.HostModel.findOne({ userId }).populate('place');
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
  ): Promise<Place> {
    const host = await this.HostModel.findOne({ userId });

    if (!host.place) {
      throw new NotFoundException('Place not found');
    }

    const place = await this.PlaceModel.findOneAndUpdate(
      { _id: host.place._id },
      updateHostPlaceDto,
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
      place.pictures = [...place.pictures, ...pictureUrls];
      await place.save();
    }

    return place;
  }

  async remove(id: string) {
    const host = await this.HostModel.findByIdAndDelete(id);
    if (!host) {
      throw new NotFoundException('Host not found!');
    }
    return host;
  }
}
