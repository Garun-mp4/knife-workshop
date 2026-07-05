import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { CurrentUser } from "../../common/current-user.decorator";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    return this.auth.login(dto.email, dto.password, response);
  }

  @Post("register")
  register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    return this.auth.register(dto.name, dto.email, dto.password, response);
  }

  @Post("refresh")
  refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.auth.refresh(request.cookies?.refresh_token, response);
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) response: Response) { return this.auth.logout(response); }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: any) { return this.auth.me(user.id); }
}
