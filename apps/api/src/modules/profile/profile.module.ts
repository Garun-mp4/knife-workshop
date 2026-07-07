import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { StorageModule } from "../storage/storage.module";
import { UploadModule } from "../upload/upload.module";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
  imports: [PrismaModule, StorageModule, UploadModule],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
