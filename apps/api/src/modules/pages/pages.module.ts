import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PagesController, PublicPagesController } from "./pages.controller";
import { PagesService } from "./pages.service";
@Module({ imports: [JwtModule.register({})], controllers: [PagesController, PublicPagesController], providers: [PagesService] })
export class PagesModule {}
