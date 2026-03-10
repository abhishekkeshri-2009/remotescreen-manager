import { BadRequestException, Controller, Get, Headers, Param, Query } from '@nestjs/common';
import { SdkService } from './sdk.service';

@Controller('sdk')
export class SdkController {
  constructor(private readonly sdkService: SdkService) {}

  @Get('screen/:screen_name')
  async getScreen(
    @Param('screen_name') screenName: string,
    @Query('app_id') appId?: string,
    @Headers('x-api-key') apiKey?: string,
  ) {
    if (!appId) throw new BadRequestException('Missing app_id');
    if (!apiKey) throw new BadRequestException('Missing x-api-key');
    return this.sdkService.getPublishedScreen({ apiKey, appId, screenName });
  }
}

