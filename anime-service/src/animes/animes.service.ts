import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAnimeDto } from './dto/create-anime.dto';

/**
 * Service métier pour la gestion des animes favoris.
 */
@Injectable()
export class AnimesService {
    constructor(private prisma: PrismaService) {}

    async create(user: string, data: CreateAnimeDto) {
        // Vérifier si l'anime existe déjà
        const existing = await this.prisma.favorite.findFirst({
            where: { user, malId: data.malId },
        });

        if (existing) {
            // Mettre à jour le statut si l'anime existe
            return this.prisma.favorite.update({
                where: { id: existing.id },
                data: {
                    status: data.status || 'à regarder',
                    title: data.title,
                    image: data.image,
                    url: data.url,
                    synopsis: data.synopsis,
                    score: data.score,
                },
            });
        }

        return this.prisma.favorite.create({
            data: {
                user,
                malId: data.malId,
                title: data.title,
                image: data.image,
                url: data.url,
                synopsis: data.synopsis,
                score: data.score,
                status: data.status || 'à regarder',
            },
        });
    }

    findAll(user: string, status?: string) {
        return this.prisma.favorite.findMany({
            where: { 
                user,
                ...(status && { status }),
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    findOne(id: number, user: string) {
        return this.prisma.favorite.findFirst({
            where: { id, user },
        });
    }

    async updateStatus(id: number, user: string, status: string) {
        return this.prisma.favorite.updateMany({
            where: { id, user },
            data: { status },
        });
    }

    remove(id: number, user: string) {
        return this.prisma.favorite.deleteMany({
            where: { id, user },
        });
    }
}

