import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = exception instanceof HttpException ? exception.getResponse() : null;
    const message = typeof body === "object" && body && "message" in body ? (body as any).message : exception instanceof Error ? exception.message : "Internal server error";
    const details = Array.isArray(message) ? message : [];

    response.status(status).json({
      success: false,
      error: {
        code: status === 400 ? "VALIDATION_ERROR" : status === 401 ? "UNAUTHORIZED" : status === 403 ? "FORBIDDEN" : "API_ERROR",
        message: Array.isArray(message) ? "Некорректные данные" : message,
        details
      }
    });
  }
}
