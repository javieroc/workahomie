import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateHostDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';
import { Host, HostDocument } from './schemas/host.schema';

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
      const image = await this.cloudinaryService.uploadImage(
        profile,
        `profile_${host.userId}`,
      );
      host.profileImages = [image.secure_url];
    }
    return host.save();
  }

  findAll(): Promise<Host[]> {
    return this.HostModel.find().exec();
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
    const host = await this.HostModel.findOneAndUpdate(
      { userId },
      updateHostDto,
      {
        new: true,
      },
    ).exec();

    if (profile) {
      const image = await this.cloudinaryService.uploadImage(
        profile,
        `profile_${host.userId}`,
      );
      host.profileImages = [image.secure_url];
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
