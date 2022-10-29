import { Module } from "@nestjs/common";
import { OpenEIService } from "./openei.service";

@Module({
  imports: [],
  providers: [OpenEIService],
})
export class OpenEIModule {}
