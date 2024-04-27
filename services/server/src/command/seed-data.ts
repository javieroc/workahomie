import * as fs from 'node:fs';
import * as path from 'node:path';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, CommandRunner } from 'nest-commander';
import { Host, HostDocument } from '../hosts/schemas/host.schema';
import { Place, PlaceDocument } from '../hosts/schemas/place.schema';

@Command({ name: 'seed-data' })
export class SeedDataCommand extends CommandRunner {
  private readonly logger = new Logger(SeedDataCommand.name);

  constructor(
    @InjectModel(Host.name) private HostModel: Model<HostDocument>,
    @InjectModel(Place.name) private PlaceModel: Model<PlaceDocument>,
  ) {
    super();
  }

  async run(): Promise<void> {
    const hosts = JSON.parse(fs.readFileSync(path.join(__dirname, 'hosts.json'), 'utf-8'));
    const places = JSON.parse(fs.readFileSync(path.join(__dirname, 'places.json'), 'utf-8'));

    await this.HostModel.create(hosts);
    await this.PlaceModel.create(places);
    this.logger.log('Hosts/Places were created successfully');
  }
}
