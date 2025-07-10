import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Command, CommandRunner } from 'nest-commander';
import { faker } from '@faker-js/faker';
import { Host, HostDocument } from '../schemas/host.schema';
import { OCCUPATIONS } from '../../constants/occupations';

@Command({ name: 'seed:occupations' })
export class UpdateOccupationsCommand extends CommandRunner {
  private readonly logger = new Logger(UpdateOccupationsCommand.name);

  constructor(@InjectModel(Host.name) private HostModel: Model<HostDocument>) {
    super();
  }

  async run(): Promise<void> {
    const hosts = await this.HostModel.find().exec();

    if (hosts.length === 0) {
      this.logger.log('No hosts to update.');
      return;
    }

    const promises = hosts.map(async (host) => {
      // eslint-disable-next-line
      host.occupation = faker.helpers.arrayElement(OCCUPATIONS);
      return host.save();
    });

    await Promise.all(promises);
    this.logger.log(`${hosts.length} hosts updated with an occupation.`);
  }
}
