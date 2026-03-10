import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SdkService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublishedScreen(input: { apiKey: string; appId: string; screenName: string }) {
    const company = await this.prisma.company.findUnique({ where: { api_key: input.apiKey } });
    if (!company) throw new ForbiddenException('Invalid api key');

    const app = await this.prisma.app.findUnique({ where: { id: input.appId } });
    if (!app) throw new NotFoundException('App not found');
    if (app.company_id !== company.id) throw new ForbiddenException('Forbidden');

    const screen = await this.prisma.screen.findUnique({
      where: { app_id_screen_name: { app_id: input.appId, screen_name: input.screenName } },
    });
    if (!screen || !screen.published) throw new NotFoundException('Published screen not found');

    return {
      screen: screen.screen_name,
      components: (screen.layout_json as any)?.components ?? [],
      layout: screen.layout_json,
    };
  }
}

