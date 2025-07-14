import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Host, HostDocument } from '../schemas/host.schema';

@Command({
  name: 'seed:pictures',
  description: 'Update hosts pictures',
})
export class UpdatePicturesCommand extends CommandRunner {
  private readonly logger = new Logger(UpdatePicturesCommand.name);

  constructor(@InjectModel(Host.name) private readonly hostModel: Model<HostDocument>) {
    super();
  }

  async run(): Promise<void> {
    this.logger.log('Updating pictures...');

    const hosts = await this.hostModel.find().exec();

    const pictures = Array.from(
      { length: 7 },
      (_, i) =>
        `https://res.cloudinary.com/dozd3b29e/image/upload/v1752493751/workahomie/workspace${i + 1}.png`,
    );

    const promises = hosts.map(async (host) => {
      // eslint-disable-next-line
      host.pictures = faker.helpers.shuffle(pictures);
      return host.save();
    });

    await Promise.all(promises);
    this.logger.log('Pictures updated successfully!');
  }
}
