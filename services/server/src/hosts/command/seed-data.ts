import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, CommandRunner } from 'nest-commander';
import { faker } from '@faker-js/faker';
import { Host, HostDocument } from '../schemas/host.schema';
import { Place, PlaceDocument } from '../schemas/place.schema';

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
    const TOTAL = 10;
    const hosts: Host[] = Array(TOTAL)
      .fill(0)
      .map(() => ({
        _id: faker.database.mongodbObjectId(),
        userId: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        occupation: faker.person.jobTitle(),
        aboutMe: faker.lorem.paragraph(2),
        profileImages: [faker.image.avatar()],
      }));

    const promises = hosts.map(async (hostData) => {
      const host = new this.HostModel(hostData);
      const place = new this.PlaceModel({
        address: faker.location.streetAddress(),
        description: faker.lorem.lines(1),
        details: faker.lorem.lines({ min: 2, max: 5 }),
        facilities: faker.helpers.arrayElements([
          'wifi',
          'snacks',
          'coffee',
          'showers',
          'parking',
          'garden',
          'kitchen',
        ]),
        pictures: [
          faker.image.urlLoremFlickr({ category: 'work' }),
          faker.image.urlLoremFlickr({ category: 'job' }),
          faker.image.urlLoremFlickr({ category: 'office' }),
          faker.image.urlLoremFlickr({ category: 'place' }),
        ],
      });
      await place.save();
      host.place = place;
      return host.save();
    });
    await Promise.all(promises);
    this.logger.log('Hosts/Places were created successfully');
  }
}
