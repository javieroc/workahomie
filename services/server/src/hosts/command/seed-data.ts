import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, CommandRunner } from 'nest-commander';
import { faker } from '@faker-js/faker';
import { Host, HostDocument } from '../schemas/host.schema';

@Command({ name: 'seed-data' })
export class SeedDataCommand extends CommandRunner {
  private readonly logger = new Logger(SeedDataCommand.name);

  constructor(@InjectModel(Host.name) private HostModel: Model<HostDocument>) {
    super();
  }

  async run(): Promise<void> {
    const TOTAL = 100;
    const CITIES_ORIGINS = [
      {
        name: 'Dublin',
        lat: 53.35014,
        lng: -6.266155,
      },
      {
        name: 'London',
        lat: 51.509865,
        lng: -0.118092,
      },
      {
        name: 'Paris',
        lat: 48.864716,
        lng: 2.349014,
      },
      {
        name: 'Sydney',
        lat: -33.865143,
        lng: 151.2099,
      },
      {
        name: 'Buenos Aires',
        lat: -34.603722,
        lng: -58.381592,
      },
      {
        name: 'New York',
        lat: 40.73061,
        lng: -73.935242,
      },
      {
        name: 'Mexico City',
        lat: 19.432608,
        lng: -99.133209,
      },
      {
        name: 'Moscow',
        lat: 55.751244,
        lng: 37.618423,
      },
    ];

    const hosts: Host[] = Array(TOTAL)
      .fill(0)
      .map(() => {
        const origin = faker.helpers.arrayElement(CITIES_ORIGINS);
        const coordinates = faker.location
          .nearbyGPSCoordinate({
            origin: [origin.lat, origin.lng], // Dublin
            radius: 10,
            isMetric: true,
          })
          .reverse();
        return {
          _id: faker.database.mongodbObjectId(),
          userId: faker.string.uuid(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          occupation: faker.person.jobTitle(),
          aboutMe: faker.lorem.paragraph(2),
          profileImages: [faker.image.avatar()],
          address: faker.location.streetAddress(),
          location: {
            type: 'Point',
            coordinates,
          },
          placeDescription: faker.lorem.lines(1),
          placeDetails: faker.lorem.lines({ min: 2, max: 5 }),
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
            faker.image.urlLoremFlickr({ category: 'art' }),
            faker.image.urlLoremFlickr({ category: 'office' }),
            faker.image.urlLoremFlickr({ category: 'place' }),
            faker.image.urlLoremFlickr({ category: 'art' }),
          ],
        };
      });

    const promises = hosts.map(async (hostData) => {
      const host = new this.HostModel(hostData);
      return host.save();
    });
    await Promise.all(promises);
    this.logger.log('Hosts/Places were created successfully');
  }
}
