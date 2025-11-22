import { Module } from '@nestjs/common';
import { AnimesModule } from './animes/animes.module';
import {PrismaService} from "../prisma/prisma.service";
import {HealthController} from "./health.controller";

@Module({
  imports: [AnimesModule],
  providers: [PrismaService],
  controllers: [HealthController],
})
export class AppModule {}
