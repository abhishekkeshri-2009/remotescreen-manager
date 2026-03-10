import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type RequestUser = { userId: string; companyId: string };

export const ReqUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user as RequestUser;
});

