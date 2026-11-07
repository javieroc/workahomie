import { Types } from 'mongoose';
import { HostsController } from './hosts.controller';

describe('HostsController.findAllWishlisted', () => {
  it('marks hosts as wishlisted by comparing ids as strings', async () => {
    const wishlistedId = new Types.ObjectId();
    const otherId = new Types.ObjectId();
    const hostsService = {
      findAll: jest.fn().mockResolvedValue({
        // Different ObjectId instances with the same value as the wishlist entry.
        data: [
          { _id: new Types.ObjectId(wishlistedId.toString()), firstName: 'A' },
          { _id: otherId, firstName: 'B' },
        ],
        total: 2,
      }),
    };
    const wishlistsService = { getWishlist: jest.fn().mockResolvedValue([wishlistedId]) };
    const controller = new HostsController(
      hostsService as never,
      {} as never,
      {} as never,
      wishlistsService as never,
    );

    const result = await controller.findAllWishlisted('user-1', {});

    expect(wishlistsService.getWishlist).toHaveBeenCalledWith('user-1');
    expect(result.total).toBe(2);
    expect(result.data.map((h) => h.isWishlisted)).toEqual([true, false]);
  });
});
