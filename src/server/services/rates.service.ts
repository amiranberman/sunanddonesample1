import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class RatesService {
  constructor(private readonly prismaService: PrismaService) {}
}
