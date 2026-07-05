import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PublicSettingsController, SettingsController } from "./settings.controller";
import { SettingsService } from "./settings.service";
@Module({ imports: [JwtModule.register({})], controllers: [SettingsController, PublicSettingsController], providers: [SettingsService] })
export class SettingsModule {}
