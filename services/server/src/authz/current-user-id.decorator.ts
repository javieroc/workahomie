import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RequestWithUser } from 'src/interfaces/RequestWithUser';

/**
 * Auth0 subjects look like `provider|id`. Existing data stores only the `id` part.
 */
export function userIdFromSub(sub?: unknown): string | undefined {
  if (typeof sub !== 'string') return undefined;
  const id = sub.split('|')[1];
  return id || undefined;
}

export const CurrentUserId = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<RequestWithUser>();
  const userId = userIdFromSub(req.user?.sub);
  if (!userId) {
    throw new UnauthorizedException();
  }
  return userId;
});
