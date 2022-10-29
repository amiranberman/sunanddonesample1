import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { InstallerService } from "./installer.service";

@Injectable()
export class SolarPanelService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly installerService: InstallerService
  ) {}
  async create(input: Prisma.SolarPanelCreateArgs) {
    return this.prismaService.solarPanel.create(input);
  }
  async find(input: Prisma.SolarPanelFindUniqueArgs) {
    return this.prismaService.solarPanel.findUnique(input);
  }
  async getInstallerCost(installerId: string, solarPanelId: string) {
    try {
      await this.prismaService.installerSolarPanel.findUnique({
        where: {
          installerId_solarPanelId: {
            installerId,
            solarPanelId,
          },
        },
      });
    } catch (error) {}
  }
}
