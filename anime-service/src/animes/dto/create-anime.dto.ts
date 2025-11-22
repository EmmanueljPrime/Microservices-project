import { IsNotEmpty, IsString, IsInt, IsOptional, IsUrl, IsNumber, IsPositive } from 'class-validator';

export class CreateAnimeDto {
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    malId: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsUrl()
    url?: string;

    @IsOptional()
    @IsString()
    synopsis?: string;

    @IsOptional()
    @IsNumber()
    score?: number;
}
