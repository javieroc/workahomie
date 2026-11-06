import { ArgumentMetadata, BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateRequestDto } from './create-request.dto';
import { UpdateRequestStatusDto } from './update-request-status.dto';

const pipe = new ValidationPipe({ transform: true, whitelist: true });
const body = (metatype: ArgumentMetadata['metatype']): ArgumentMetadata => ({
  type: 'body',
  metatype,
});

describe('request DTO validation', () => {
  it('strips userId and status from the create body', async () => {
    const result = await pipe.transform(
      {
        checkIn: '2026-11-10',
        checkOut: '2026-11-12',
        userId: 'someone-else',
        status: 'accepted',
      },
      body(CreateRequestDto),
    );
    expect(result).not.toHaveProperty('userId');
    expect(result).not.toHaveProperty('status');
  });

  it.each(['accepted', 'declined', 'cancelled'])('accepts status %s', async (status) => {
    await expect(pipe.transform({ status }, body(UpdateRequestStatusDto))).resolves.toEqual({
      status,
    });
  });

  it('rejects other statuses and only keeps status', async () => {
    await expect(
      pipe.transform({ status: 'pending' }, body(UpdateRequestStatusDto)),
    ).rejects.toBeInstanceOf(BadRequestException);
    const result = await pipe.transform(
      { status: 'accepted', checkIn: '2020-01-01' },
      body(UpdateRequestStatusDto),
    );
    expect(result).toEqual({ status: 'accepted' });
  });
});
