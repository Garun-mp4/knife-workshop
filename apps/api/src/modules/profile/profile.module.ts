import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../../prisma/prisma.module";
import { StorageModule } from "../storage/storage.module";
import { UploadModule } from "../upload/upload.module";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
  imports: [PrismaModule, StorageModule, UploadModule, JwtModule.register({})],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
