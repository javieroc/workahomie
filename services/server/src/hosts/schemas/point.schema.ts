import { Prop } from '@nestjs/mongoose';

class Point {
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
  })
  type: string;

  @Prop({
    coordinates: {
      type: [Number],
    },
  })
  coordinates: number[]; // [longitude, latitude]
}

export { Point };
