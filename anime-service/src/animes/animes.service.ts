import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAnimeDto } from './dto/create-anime.dto';

/**
 * Service métier pour la gestion des commandes.
 */
@Injectable()
export class AnimesService {
    constructor(private prisma: PrismaService) {}

    create(user: string, data: CreateAnimeDto) {
        return this.prisma.favorite.create({
            data: {
                user,
                malId: data.malId,
                title: data.title,
                image: data.image,
                url: data.url,
                synopsis: data.synopsis,
                score: data.score,
            },
        });
    }

    findAll(user: string) {
        return this.prisma.favorite.findMany({
            where: { user },
            orderBy: { createdAt: 'desc' },
        });
    }

    findOne(id: number, user: string) {
        return this.prisma.favorite.findFirst({
            where: { id, user },
        });
    }

    remove(id: number, user: string) {
        return this.prisma.favorite.deleteMany({
            where: { id, user },
        });
    }
}

