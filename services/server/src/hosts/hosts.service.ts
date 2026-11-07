import { Model, FilterQuery, PipelineStage, Types } from 'mongoose';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FindAllResponse } from 'src/dto/response.dto';
import { Review, ReviewDocument } from 'src/reviews/entities/review.schema';
import { CreateHostDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';
import { Host, HostDocument } from './schemas/host.schema';
import { UpdateHostPlaceDto } from './dto/update-host-place.dto';
import { DEFAULT_RADIUS_KM, MAX_RADIUS_KM, SearchParamsDto } from './dto/search-params.dto';

export const MAX_PAGE_SIZE = 50;
export const MAX_PINS = 1000;

/** Fields never exposed by public endpoints. */
export const PRIVATE_FIELDS = { phone: 0, __v: 0 } as const;

export type HostPublic = Omit<Host, 'phone'> & { distance?: number };

export interface Pin {
  _id: Types.ObjectId;
  location: Host['location'];
  firstName: string;
  lastName: string;
  occupation: string;
  rate: number;
  countReviews: number;
  picture?: string;
}

const PIN_PROJECTION = {
  _id: 1,
  location: 1,
  firstName: 1,
  lastName: 1,
  occupation: 1,
  rate: 1,
  countReviews: 1,
  pictures: { $slice: ['$pictures', 1] },
  profileImages: { $slice: ['$profileImages', 1] },
};

export interface HostSearchQuery {
  /** Attribute + bbox filter (also used as `$geoNear.query`). */
  filter: FilterQuery<Host>;
  /** Present when a center was given: results are sorted by distance via `$geoNear`. */
  geoNear?: PipelineStage.GeoNear['$geoNear'];
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function hasBoundingBox({ swLat, swLng, neLat, neLng }: SearchParamsDto): boolean {
  return [swLat, swLng, neLat, neLng].every(isFiniteNumber);
}

/**
 * Builds the Mongo filter for a host search.
 * - bbox (all four corners) → `$geoWithin.$box` (planar lat/lng rectangle, i.e. a map viewport).
 *   A box crossing the antimeridian (swLng > neLng) is clamped to [swLng, 180].
 * - center (lat+lng) → `$geoNear` sorted by distance; `radius` (km) applies only without a bbox.
 */
export function buildHostSearchQuery(params: SearchParamsDto): HostSearchQuery {
  const { lat, lng, radius, occupations, facilities, rate } = params;
  const filter: FilterQuery<Host> = {};

  if (occupations?.length) filter.occupation = { $in: occupations };
  if (facilities?.length) filter.facilities = { $all: facilities };
  if (isFiniteNumber(rate) && rate > 0) filter.rate = { $gte: rate };

  const bbox = hasBoundingBox(params);
  if (bbox) {
    const swLat = clamp(params.swLat, -90, 90);
    const neLat = clamp(params.neLat, -90, 90);
    const swLng = clamp(params.swLng, -180, 180);
    let neLng = clamp(params.neLng, -180, 180);
    if (swLng > neLng) neLng = 180;
    filter.location = {
      $geoWithin: {
        $box: [
          [swLng, Math.min(swLat, neLat)],
          [neLng, Math.max(swLat, neLat)],
        ],
      },
    };
  }

  if (!isFiniteNumber(lat) || !isFiniteNumber(lng)) {
    return { filter };
  }

  const geoNear: PipelineStage.GeoNear['$geoNear'] = {
    near: { type: 'Point', coordinates: [lng, lat] },
    key: 'location',
    spherical: true,
    distanceField: 'distance',
    query: filter,
  };
  if (!bbox) {
    const radiusKm = isFiniteNumber(radius) && radius > 0 ? radius : DEFAULT_RADIUS_KM;
    geoNear.maxDistance = Math.min(radiusKm, MAX_RADIUS_KM) * 1000;
  }
  return { filter, geoNear };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toPin = ({ pictures, profileImages, ...host }: Record<string, any>): Pin =>
  ({
    ...host,
    picture: pictures?.[0] ?? profileImages?.[0],
  }) as Pin;

@Injectable()
export class HostsService {
  private readonly logger = new Logger(HostsService.name);

  constructor(
    @InjectModel(Host.name) private HostModel: Model<HostDocument>,
    @InjectModel(Review.name) private ReviewModel: Model<ReviewDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createHostDto: CreateHostDto & { userId: string },
    profile?: Express.Multer.File,
  ): Promise<Host> {
    const host = new this.HostModel(createHostDto);

    if (profile) {
      const image = await this.cloudinaryService.uploadImage(profile, `profile_${host.userId}`);
      host.profileImages = [image.secure_url];
    }

    return host.save();
  }

  async findAll(params: SearchParamsDto): Promise<FindAllResponse<HostPublic>> {
    const limit = Math.min(params.limit ?? 10, MAX_PAGE_SIZE);
    const offset = params.offset ?? 0;
    const { filter, geoNear } = buildHostSearchQuery(params);

    if (geoNear) {
      const [result] = await this.HostModel.aggregate<{
        data: HostPublic[];
        total: { count: number }[];
      }>([
        { $geoNear: geoNear },
        { $project: PRIVATE_FIELDS },
        {
          $facet: {
            data: [{ $skip: offset }, { $limit: limit }],
            total: [{ $count: 'count' }],
          },
        },
      ]).exec();
      return { data: result?.data ?? [], total: result?.total?.[0]?.count ?? 0 };
    }

    const [total, data] = await Promise.all([
      this.HostModel.countDocuments(filter).exec(),
      this.HostModel.find(filter, PRIVATE_FIELDS)
        .sort({ _id: 1 })
        .skip(offset)
        .limit(limit)
        .lean<HostPublic[]>()
        .exec(),
    ]);
    return { data, total };
  }

  /** Lightweight markers for map clustering. Requires a bounding box. */
  async findPins(params: SearchParamsDto): Promise<{ data: Pin[] }> {
    if (!hasBoundingBox(params)) {
      throw new BadRequestException('swLat, swLng, neLat and neLng are required');
    }
    const { filter, geoNear } = buildHostSearchQuery(params);
    const pipeline: PipelineStage[] = geoNear
      ? [{ $geoNear: geoNear }]
      : [{ $match: filter }, { $sort: { _id: 1 } }];
    pipeline.push({ $limit: MAX_PINS }, { $project: PIN_PROJECTION });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await this.HostModel.aggregate<Record<string, any>>(pipeline).exec();
    return { data: rows.map(toPin) };
  }

  /** Public host detail (no phone). */
  async findPublic(id: string): Promise<HostPublic> {
    const host = await this.HostModel.findById(id, PRIVATE_FIELDS).lean<HostPublic>().exec();
    if (!host) {
      throw new NotFoundException('Host not found!');
    }
    return host;
  }

  /** Internal lookup (full document, includes phone). Never return it from public endpoints. */
  async findById(id: string): Promise<HostDocument> {
    const host = await this.HostModel.findById(id).exec();
    if (!host) {
      throw new NotFoundException('Host not found!');
    }
    return host;
  }

  async findMe(userId: string): Promise<HostDocument | null> {
    return this.HostModel.findOne({ userId }).exec();
  }

  async update(
    { userId, ...updateHostDto }: UpdateHostDto & { userId: string },
    profile?: Express.Multer.File,
  ): Promise<Host> {
    const host = await this.HostModel.findOneAndUpdate({ userId }, updateHostDto, {
      new: true,
    }).exec();
    if (!host) {
      throw new NotFoundException('Host not found');
    }

    if (profile) {
      const image = await this.cloudinaryService.uploadImage(profile, `profile_${host.userId}`);
      host.profileImages = [image.secure_url];
      await host.save();
    }

    return host;
  }

  async updatePlace(
    {
      userId,
      existingPictures = [],
      address,
      ...updateHostPlaceDto
    }: UpdateHostPlaceDto & { userId: string },
    pictures: Array<Express.Multer.File> = [],
  ): Promise<Host> {
    const location = address !== undefined ? this.parseAddressLocation(address) : undefined;

    const host = await this.HostModel.findOne({ userId }).exec();
    if (!host) {
      throw new NotFoundException('Host not found');
    }

    const currentPictures = host.pictures ?? [];
    // Only pictures already attached to this host can be kept (no arbitrary URL injection).
    const kept = currentPictures.filter((url) => existingPictures.includes(url));
    const removed = currentPictures.filter((url) => !kept.includes(url));

    let newUploadedUrls: string[] = [];
    if (pictures?.length > 0) {
      const uploaded = await Promise.all(
        pictures.map((picture) =>
          this.cloudinaryService.uploadImage(
            picture,
            `place_${userId}_${Date.now()}_${picture.originalname}`,
          ),
        ),
      );
      newUploadedUrls = uploaded.map((img) => img.secure_url);
    }

    host.set({
      ...updateHostPlaceDto,
      ...(address !== undefined ? { address, location } : {}),
      pictures: [...kept, ...newUploadedUrls],
    });
    await host.save();

    await this.deleteOwnImages(userId, removed);

    return host;
  }

  /** Deletes the caller's host, its reviews and (best-effort) its uploaded images. */
  async removeMine(userId: string): Promise<{ deleted: true }> {
    const host = await this.HostModel.findOne({ userId }).exec();
    if (!host) {
      throw new NotFoundException('Host not found');
    }

    await this.ReviewModel.deleteMany({ host: host._id }).exec();
    await this.HostModel.deleteOne({ _id: host._id }).exec();
    await this.deleteOwnImages(userId, [...(host.pictures ?? []), ...(host.profileImages ?? [])]);

    return { deleted: true };
  }

  private parseAddressLocation(address: string) {
    let parsed: { lat?: unknown; lon?: unknown } | null;
    try {
      parsed = JSON.parse(address);
    } catch {
      throw new BadRequestException('address must be a JSON object with lat and lon');
    }
    if (!parsed || typeof parsed !== 'object') {
      throw new BadRequestException('address must be a JSON object with lat and lon');
    }

    const lat = Number.parseFloat(String(parsed.lat));
    const lon = Number.parseFloat(String(parsed.lon));
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      Math.abs(lat) > 90 ||
      Math.abs(lon) > 180
    ) {
      throw new BadRequestException('address lat/lon must be valid coordinates');
    }

    return { type: 'Point', coordinates: [lon, lat] };
  }

  /**
   * Best-effort Cloudinary cleanup. Only images uploaded for this user (public id
   * `profile_<userId>` / `place_<userId>_...`) are deleted, so shared seed images are never touched.
   */
  private async deleteOwnImages(userId: string, urls: string[]): Promise<void> {
    const own = urls.filter(
      (url) =>
        typeof url === 'string' &&
        (url.includes(`/profile_${userId}.`) || url.includes(`/place_${userId}_`)),
    );
    if (own.length === 0) return;

    const results = await Promise.allSettled(
      own.map((url) => this.cloudinaryService.deleteImage(url)),
    );
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        this.logger.warn(`Could not delete image ${own[index]}: ${result.reason}`);
      }
    });
  }
}
