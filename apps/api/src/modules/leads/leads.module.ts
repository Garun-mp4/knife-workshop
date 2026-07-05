import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { LeadsController, PublicLeadsController } from "./leads.controller";
import { LeadsService } from "./leads.service";
import { NotificationsModule } from "../notifications/notifications.module";
@Module({ imports: [JwtModule.register({}), NotificationsModule], controllers: [LeadsController, PublicLeadsController], providers: [LeadsService] })
export class LeadsModule {}
