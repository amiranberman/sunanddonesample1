import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class PropertyService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(input: Prisma.PropertyCreateArgs) {
    this.prismaService.property.create(input);
  }
  async find(input: Prisma.PropertyFindUniqueArgs) {
    this.prismaService.property.findUnique(input);
  }
  async findUniqueOrThrow(input: Prisma.PropertyFindUniqueOrThrowArgs) {
    this.prismaService.property.findUniqueOrThrow(input);
  }
}
