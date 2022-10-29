import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class BillService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(input: Prisma.BillCreateInput) {
    return this.prismaService.bill.create({
      data: input,
    });
  }
  async find(input: Prisma.BillFindUniqueArgs) {
    return this.prismaService.bill.findUnique(input);
  }
}
