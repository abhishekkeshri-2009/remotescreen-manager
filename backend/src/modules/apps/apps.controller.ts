import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReqUser, RequestUser } from '../auth/request-user.decorator';
import { CreateAppDto } from './dto/create-app.dto';
import { AppsService } from './apps.service';

@Controller('apps')
@UseGuards(JwtAuthGuard)
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Post()
  async create(@ReqUser() user: RequestUser, @Body() dto: CreateAppDto) {
    return this.appsService.create(user.companyId, dto);
  }

  @Get()
  async list(@ReqUser() user: RequestUser) {
    return this.appsService.list(user.companyId);
  }
}

