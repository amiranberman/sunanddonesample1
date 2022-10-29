import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class InstallerService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(input: Prisma.InstallerCreateArgs) {
    return this.prismaService.installer.create(input);
  }
  async find(input: Prisma.InstallerFindUniqueArgs) {
    return this.prismaService.installer.findUnique(input);
  }
  async findByName(name: string) {
    try {
      return await this.prismaService.installer.findUnique({
        where: {
          name,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
