import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppDto } from './dto/create-app.dto';

@Injectable()
export class AppsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(companyId: string, dto: CreateAppDto) {
    return this.prisma.app.create({
      data: { name: dto.name, company_id: companyId },
      select: { id: true, name: true, company_id: true, createdAt: true, updatedAt: true },
    });
  }

  async list(companyId: string) {
    return this.prisma.app.findMany({
      where: { company_id: companyId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, company_id: true, createdAt: true, updatedAt: true },
    });
  }
}

