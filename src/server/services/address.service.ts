import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class AddressService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(input: Prisma.AddressCreateInput) {
    if (!input.sunnumber) {
      input.sunnumber = await this.prismaService.state
        .findUnique({
          where: {
            name: input.state,
          },
        })
        .then((data) => data?.sunnumber!);
    }
    return this.prismaService.address.create({
      data: input,
    });
  }
  async find(input: Prisma.AddressFindUniqueArgs) {
    return this.prismaService.address.findUnique(input);
  }
  async findUniqueOrThrow(input: Prisma.AddressFindUniqueOrThrowArgs) {
    return this.prismaService.address.findUniqueOrThrow(input);
  }
}
