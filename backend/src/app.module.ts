import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppsModule } from './modules/apps/apps.module';
import { ScreensModule } from './modules/screens/screens.module';
import { SdkModule } from './modules/sdk/sdk.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AppsModule,
    ScreensModule,
    SdkModule,
  ],
})
export class AppModule {}

