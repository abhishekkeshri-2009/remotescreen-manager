import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReqUser, RequestUser } from '../auth/request-user.decorator';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { ScreensService } from './screens.service';

@Controller('screens')
@UseGuards(JwtAuthGuard)
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @Post()
  async create(@ReqUser() user: RequestUser, @Body() dto: CreateScreenDto) {
    return this.screensService.create(user.companyId, dto);
  }

  @Get()
  async list(@ReqUser() user: RequestUser, @Query('app_id') appId?: string) {
    return this.screensService.list(user.companyId, appId);
  }

  @Put(':id')
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: UpdateScreenDto,
  ) {
    return this.screensService.update(user.companyId, id, dto);
  }

  @Post(':id/publish')
  async publish(@ReqUser() user: RequestUser, @Param('id') id: string) {
    return this.screensService.publish(user.companyId, id);
  }
}

