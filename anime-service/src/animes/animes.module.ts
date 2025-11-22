import { Module } from '@nestjs/common';
import { AnimesController } from './animes.controller';
import { AnimesService } from './animes.service';
import {PrismaService} from "../../prisma/prisma.service";

@Module({
  controllers: [AnimesController],
  providers: [AnimesService, PrismaService]
})
export class AnimesModule {}
