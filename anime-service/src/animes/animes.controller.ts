import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
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
    findAll(@User() user: any) {
        return this.animesService.findAll(user.sub);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @User() user: any) {
        return this.animesService.findOne(id, user.sub);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @User() user: any) {
        return this.animesService.remove(id, user.sub);
    }
}

