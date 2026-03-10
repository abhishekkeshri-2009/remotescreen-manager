import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';

@Injectable()
export class ScreensService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertAppBelongsToCompany(appId: string, companyId: string) {
    const app = await this.prisma.app.findUnique({ where: { id: appId } });
    if (!app) throw new NotFoundException('App not found');
    if (app.company_id !== companyId) throw new ForbiddenException('Forbidden');
    return app;
  }

  private async assertScreenBelongsToCompany(screenId: string, companyId: string) {
    const screen = await this.prisma.screen.findUnique({
      where: { id: screenId },
      include: { app: true },
    });
    if (!screen) throw new NotFoundException('Screen not found');
    if (screen.app.company_id !== companyId) throw new ForbiddenException('Forbidden');
    return screen;
  }

  async create(companyId: string, dto: CreateScreenDto) {
    await this.assertAppBelongsToCompany(dto.app_id, companyId);
    return this.prisma.screen.create({
      data: {
        app_id: dto.app_id,
        screen_name: dto.screen_name,
        layout_json: dto.layout_json as any,
        published: false,
      },
      select: {
        id: true,
        app_id: true,
        screen_name: true,
        layout_json: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async list(companyId: string, appId?: string) {
    if (appId) await this.assertAppBelongsToCompany(appId, companyId);

    return this.prisma.screen.findMany({
      where: {
        app: { company_id: companyId },
        ...(appId ? { app_id: appId } : {}),
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        app_id: true,
        screen_name: true,
        layout_json: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(companyId: string, id: string, dto: UpdateScreenDto) {
    await this.assertScreenBelongsToCompany(id, companyId);
    return this.prisma.screen.update({
      where: { id },
      data: {
        ...(dto.screen_name ? { screen_name: dto.screen_name } : {}),
        ...(dto.layout_json !== undefined ? { layout_json: dto.layout_json as any } : {}),
      },
      select: {
        id: true,
        app_id: true,
        screen_name: true,
        layout_json: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async publish(companyId: string, id: string) {
    await this.assertScreenBelongsToCompany(id, companyId);
    return this.prisma.screen.update({
      where: { id },
      data: { published: true },
      select: {
        id: true,
        app_id: true,
        screen_name: true,
        published: true,
        updatedAt: true,
      },
    });
  }
}

