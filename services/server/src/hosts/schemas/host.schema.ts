import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HostDocument = HydratedDocument<Host>;

@Schema()
export class Host {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  occupation: string;

  @Prop()
  aboutMe: string;
}

export const HostSchema = SchemaFactory.createForClass(Host);
