import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnimesService } from './animes.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';

/**
 * Contrôleur REST pour les animes utilisateur.
 * Toutes les routes nécessitent un JWT valide.
 */
@Controller('animes')
@UseGuards(JwtAuthGuard)
export class AnimesController {
  constructor(private readonly animesService: AnimesService) {}

  @Post()
  create(@User() user: any, @Body() dto: CreateAnimeDto) {
    return this.animesService.create(user.sub, dto);
  }

  @Get()
  findAll(@User() user: any, @Query('status') status?: string) {
    return this.animesService.findAll(user.sub, status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @User() user: any) {
      return this.animesService.findOne(id, user.sub);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @User() user: any,
    @Body('status') status: string,
  ) {
    return this.animesService.updateStatus(id, user.sub, status);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    return this.animesService.remove(id, user.sub);
  }
}
