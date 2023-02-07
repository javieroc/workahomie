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
      const image = await this.cloudinaryService.uploadImage(profile);
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

  async update(id: string, updateHostDto: UpdateHostDto): Promise<Host> {
    const host = await this.HostModel.findByIdAndUpdate(id, updateHostDto, {
      new: true,
    }).exec();
    if (!host) {
      throw new NotFoundException('Host not found!');
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
