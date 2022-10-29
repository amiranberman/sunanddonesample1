import { Module } from "@nestjs/common";
import { BillService } from "../services/bill.service";
import { AddressService } from "../services/address.service";
import { PrismaService } from "../services/prisma.service";
import { PropertyService } from "../services/property.service";
import { QuoteService } from "../services/quote.service";
import { RatesService } from "../services/rates.service";
import { OpenEIModule } from "../services/openei/openei.module";

@Module({
  imports: [OpenEIModule],
  providers: [
    PrismaService,
    BillService,
    PropertyService,
    QuoteService,
    AddressService,
    RatesService,
  ],
})
export class AppModule {}
