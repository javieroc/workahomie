import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, CommandRunner } from 'nest-commander';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { Host, HostDocument } from '../schemas/host.schema';
import { Place, PlaceDocument } from '../schemas/place.schema';

const hosts: Host[] = Array(6)
  .fill(0)
  .map(() => ({
    _id: faker.database.mongodbObjectId(),
    userId: randomUUID(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    occupation: faker.person.jobTitle(),
    aboutMe: faker.lorem.paragraph(2),
    profileImages: [faker.image.avatar()],
  }));

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
    const promises = hosts.map(async (hostData) => {
      const host = new this.HostModel(hostData);
      const place = new this.PlaceModel();
      await place.save();
      host.place = place;
      return host.save();
    });
    await Promise.all(promises);
    this.logger.log('Hosts were created successfully');
  }
}
