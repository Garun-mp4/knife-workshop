import { createParamDecorator, ExecutionContext } from "@nestjs/common";
export type CurrentUserPayload = { id: string; email: string; role: string; name?: string };
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user as CurrentUserPayload | undefined);
